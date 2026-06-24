// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {MBGRoles} from "./access/MBGRoles.sol";

/**
 * @title VendorCredentialRegistry
 * @notice Blockchain-backed storage for MBG vendor credentials & certificates,
 *         integrated with Badan Gizi Nasional (BGN) approval.
 *
 * Supports the platform goal of integrating NPWP, izin usaha (NIB) and
 * certification documents with tamper-proof, transparent verification. Only
 * document hashes (e.g. IPFS CIDs) live on-chain — the documents themselves
 * stay off-chain — guaranteeing authenticity without exposing private data.
 */
contract VendorCredentialRegistry is MBGRoles {
    struct Vendor {
        bytes32 npwpHash; // hash of NPWP (tax id)
        bytes32 nibHash; // hash of NIB / izin usaha
        bool bgnApproved; // approved by Badan Gizi Nasional
        bool isUMKM; // local producer / UMKM flag
        uint64 registeredAt;
        bool exists;
    }

    struct Certificate {
        string certType; // "SLHS", "HALAL", "HACCP", "ISO22000", ...
        bytes32 docHash; // off-chain document hash / IPFS CID
        address issuer;
        uint64 issuedAt;
        uint64 validUntil;
        bool revoked;
    }

    mapping(bytes32 => Vendor) private _vendors;
    mapping(bytes32 => Certificate[]) private _certs;
    bytes32[] private _vendorIds;

    event VendorRegistered(bytes32 indexed vendorId, bytes32 npwpHash, bytes32 nibHash, bool isUMKM);
    event CertificateAdded(bytes32 indexed vendorId, string certType, bytes32 docHash, uint64 validUntil);
    event CertificateRevoked(bytes32 indexed vendorId, uint256 index, string reason);
    event BGNApprovalSet(bytes32 indexed vendorId, bool approved, address by);

    error VendorNotFound(bytes32 vendorId);
    error InvalidValidity();
    error IndexOutOfRange();

    /// @notice Register a vendor with its NPWP & NIB hashes.
    function registerVendor(
        bytes32 vendorId,
        bytes32 npwpHash,
        bytes32 nibHash,
        bool isUMKM
    ) external onlyRole(SUPPLIER) {
        if (!_vendors[vendorId].exists) _vendorIds.push(vendorId);
        _vendors[vendorId] = Vendor({
            npwpHash: npwpHash,
            nibHash: nibHash,
            bgnApproved: _vendors[vendorId].bgnApproved,
            isUMKM: isUMKM,
            registeredAt: uint64(block.timestamp),
            exists: true
        });
        emit VendorRegistered(vendorId, npwpHash, nibHash, isUMKM);
    }

    /// @notice Anchor a certificate document hash for a vendor.
    function addCertificate(
        bytes32 vendorId,
        string calldata certType,
        bytes32 docHash,
        uint64 validUntil
    ) external onlyRole(INSPECTOR) {
        if (!_vendors[vendorId].exists) revert VendorNotFound(vendorId);
        if (validUntil <= block.timestamp) revert InvalidValidity();
        _certs[vendorId].push(
            Certificate({
                certType: certType,
                docHash: docHash,
                issuer: msg.sender,
                issuedAt: uint64(block.timestamp),
                validUntil: validUntil,
                revoked: false
            })
        );
        emit CertificateAdded(vendorId, certType, docHash, validUntil);
    }

    /// @notice BGN sets/clears approval for a vendor.
    function setBGNApproval(bytes32 vendorId, bool approved) external onlyRole(REGULATOR) {
        if (!_vendors[vendorId].exists) revert VendorNotFound(vendorId);
        _vendors[vendorId].bgnApproved = approved;
        emit BGNApprovalSet(vendorId, approved, msg.sender);
    }

    function revokeCertificate(bytes32 vendorId, uint256 index, string calldata reason)
        external
        onlyRole(REGULATOR)
    {
        if (index >= _certs[vendorId].length) revert IndexOutOfRange();
        _certs[vendorId][index].revoked = true;
        emit CertificateRevoked(vendorId, index, reason);
    }

    /// @notice A vendor is fully verified when BGN-approved and holding at least
    ///         one valid (non-revoked, unexpired) certificate.
    function isVerified(bytes32 vendorId) external view returns (bool) {
        if (!_vendors[vendorId].bgnApproved) return false;
        Certificate[] storage cs = _certs[vendorId];
        for (uint256 i = 0; i < cs.length; i++) {
            if (!cs[i].revoked && cs[i].validUntil > block.timestamp) return true;
        }
        return false;
    }

    /// @notice Verify a specific document hash belongs to a vendor and is valid.
    function verifyCertificate(bytes32 vendorId, bytes32 docHash) external view returns (bool) {
        Certificate[] storage cs = _certs[vendorId];
        for (uint256 i = 0; i < cs.length; i++) {
            if (cs[i].docHash == docHash && !cs[i].revoked && cs[i].validUntil > block.timestamp) {
                return true;
            }
        }
        return false;
    }

    function getVendor(bytes32 vendorId)
        external
        view
        returns (bytes32 npwpHash, bytes32 nibHash, bool bgnApproved, bool isUMKM, uint64 registeredAt)
    {
        Vendor storage v = _vendors[vendorId];
        if (!v.exists) revert VendorNotFound(vendorId);
        return (v.npwpHash, v.nibHash, v.bgnApproved, v.isUMKM, v.registeredAt);
    }

    function certificateCount(bytes32 vendorId) external view returns (uint256) {
        return _certs[vendorId].length;
    }

    function getCertificate(bytes32 vendorId, uint256 index)
        external
        view
        returns (string memory certType, bytes32 docHash, uint64 issuedAt, uint64 validUntil, bool revoked)
    {
        if (index >= _certs[vendorId].length) revert IndexOutOfRange();
        Certificate storage c = _certs[vendorId][index];
        return (c.certType, c.docHash, c.issuedAt, c.validUntil, c.revoked);
    }

    function totalVendors() external view returns (uint256) {
        return _vendorIds.length;
    }
}
