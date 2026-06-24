// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {MBGRoles} from "./access/MBGRoles.sol";

/**
 * @title PermitRegistry
 * @notice On-chain registry for vendor/kitchen (SPPG) permits, certifications
 *         and inspection records — the immutable backbone of the
 *         "Platform Perizinan & Pengawasan Vendor MBG" feature.
 *
 * Solves: scattered vendor data, untracked permit status, hard-to-audit
 * inspections, low transparency. Every issuance, inspection and revocation is
 * a tamper-evident event with a verifiable timestamp.
 */
contract PermitRegistry is MBGRoles {
    enum PermitType {
        SLHS, // Sertifikat Laik Higiene Sanitasi
        HALAL,
        HACCP,
        OPERATIONAL
    }

    struct Permit {
        string permitNo;
        PermitType permitType;
        uint64 issuedAt;
        uint64 validUntil;
        bool revoked;
        bool exists;
    }

    struct Inspection {
        uint16 score; // 0 - 100
        string ipfsReport; // off-chain report hash (IPFS CID)
        uint64 timestamp;
        address inspector;
    }

    // entityId = keccak256(off-chain entity identifier)
    mapping(bytes32 => Permit) private _permits;
    mapping(bytes32 => Inspection[]) private _inspections;
    bytes32[] private _entities;

    event PermitIssued(
        bytes32 indexed entityId,
        string permitNo,
        PermitType permitType,
        uint64 validUntil,
        address issuer
    );
    event InspectionRecorded(
        bytes32 indexed entityId,
        uint16 score,
        string ipfsReport,
        address inspector
    );
    event PermitRevoked(bytes32 indexed entityId, string reason, address by);

    error PermitNotFound(bytes32 entityId);
    error InvalidScore(uint16 score);
    error InvalidValidity();

    /// @notice Issue or renew a permit for an entity. Regulator only.
    function issuePermit(
        bytes32 entityId,
        string calldata permitNo,
        PermitType permitType,
        uint64 validUntil
    ) external onlyRole(REGULATOR) {
        if (validUntil <= block.timestamp) revert InvalidValidity();

        if (!_permits[entityId].exists) {
            _entities.push(entityId);
        }
        _permits[entityId] = Permit({
            permitNo: permitNo,
            permitType: permitType,
            issuedAt: uint64(block.timestamp),
            validUntil: validUntil,
            revoked: false,
            exists: true
        });
        emit PermitIssued(entityId, permitNo, permitType, validUntil, msg.sender);
    }

    /// @notice Record a supervision/audit result. Inspector only.
    function recordInspection(
        bytes32 entityId,
        uint16 score,
        string calldata ipfsReport
    ) external onlyRole(INSPECTOR) {
        if (score > 100) revert InvalidScore(score);
        _inspections[entityId].push(
            Inspection({
                score: score,
                ipfsReport: ipfsReport,
                timestamp: uint64(block.timestamp),
                inspector: msg.sender
            })
        );
        emit InspectionRecorded(entityId, score, ipfsReport, msg.sender);
    }

    /// @notice Revoke a permit (e.g. after a failed inspection). Regulator only.
    function revokePermit(bytes32 entityId, string calldata reason)
        external
        onlyRole(REGULATOR)
    {
        if (!_permits[entityId].exists) revert PermitNotFound(entityId);
        _permits[entityId].revoked = true;
        emit PermitRevoked(entityId, reason, msg.sender);
    }

    /// @notice True if the entity holds a non-revoked, unexpired permit.
    function isValid(bytes32 entityId) external view returns (bool) {
        Permit storage p = _permits[entityId];
        return p.exists && !p.revoked && p.validUntil > block.timestamp;
    }

    function getPermit(bytes32 entityId)
        external
        view
        returns (
            string memory permitNo,
            PermitType permitType,
            uint64 issuedAt,
            uint64 validUntil,
            bool revoked
        )
    {
        Permit storage p = _permits[entityId];
        if (!p.exists) revert PermitNotFound(entityId);
        return (p.permitNo, p.permitType, p.issuedAt, p.validUntil, p.revoked);
    }

    function inspectionCount(bytes32 entityId) external view returns (uint256) {
        return _inspections[entityId].length;
    }

    function getInspection(bytes32 entityId, uint256 index)
        external
        view
        returns (uint16 score, string memory ipfsReport, uint64 timestamp, address inspector)
    {
        Inspection storage ins = _inspections[entityId][index];
        return (ins.score, ins.ipfsReport, ins.timestamp, ins.inspector);
    }

    function totalEntities() external view returns (uint256) {
        return _entities.length;
    }
}
