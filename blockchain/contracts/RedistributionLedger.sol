// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {MBGRoles} from "./access/MBGRoles.sol";

/**
 * @title RedistributionLedger
 * @notice Immutable ledger of inter-regional stock transfers — backs the
 *         "Platform Matching Demand-Supply Antarwilayah" feature.
 *
 * Solves: surplus/deficit invisibility and ad-hoc, untraceable redistribution.
 * Each transfer is proposed by an operator, confirmed by a regulator, and
 * finalised with a delivery proof hash — a full provenance trail.
 */
contract RedistributionLedger is MBGRoles {
    enum Status {
        Proposed,
        Confirmed,
        Delivered,
        Cancelled
    }

    struct Transfer {
        string fromRegion;
        string toRegion;
        string commodity;
        uint256 qty; // in kg (or smallest tracked unit)
        Status status;
        address proposer;
        uint64 proposedAt;
        uint64 updatedAt;
        bytes32 proofHash; // delivery proof (e.g. doc/photo hash)
    }

    Transfer[] private _transfers;

    event TransferProposed(
        uint256 indexed id,
        string fromRegion,
        string toRegion,
        string commodity,
        uint256 qty,
        address proposer
    );
    event TransferConfirmed(uint256 indexed id, address confirmedBy);
    event TransferDelivered(uint256 indexed id, bytes32 proofHash);
    event TransferCancelled(uint256 indexed id, string reason);

    error InvalidId(uint256 id);
    error InvalidState(uint256 id, Status current);
    error EmptyQuantity();

    /// @notice Operator proposes a redistribution between two regions.
    function proposeTransfer(
        string calldata fromRegion,
        string calldata toRegion,
        string calldata commodity,
        uint256 qty
    ) external onlyRole(OPERATOR) returns (uint256 id) {
        if (qty == 0) revert EmptyQuantity();
        id = _transfers.length;
        _transfers.push(
            Transfer({
                fromRegion: fromRegion,
                toRegion: toRegion,
                commodity: commodity,
                qty: qty,
                status: Status.Proposed,
                proposer: msg.sender,
                proposedAt: uint64(block.timestamp),
                updatedAt: uint64(block.timestamp),
                proofHash: bytes32(0)
            })
        );
        emit TransferProposed(id, fromRegion, toRegion, commodity, qty, msg.sender);
    }

    /// @notice Regulator approves a proposed transfer.
    function confirmTransfer(uint256 id) external onlyRole(REGULATOR) {
        Transfer storage t = _get(id);
        if (t.status != Status.Proposed) revert InvalidState(id, t.status);
        t.status = Status.Confirmed;
        t.updatedAt = uint64(block.timestamp);
        emit TransferConfirmed(id, msg.sender);
    }

    /// @notice Operator marks a confirmed transfer as delivered with proof.
    function markDelivered(uint256 id, bytes32 proofHash) external onlyRole(OPERATOR) {
        Transfer storage t = _get(id);
        if (t.status != Status.Confirmed) revert InvalidState(id, t.status);
        t.status = Status.Delivered;
        t.proofHash = proofHash;
        t.updatedAt = uint64(block.timestamp);
        emit TransferDelivered(id, proofHash);
    }

    function cancelTransfer(uint256 id, string calldata reason) external onlyRole(REGULATOR) {
        Transfer storage t = _get(id);
        if (t.status == Status.Delivered) revert InvalidState(id, t.status);
        t.status = Status.Cancelled;
        t.updatedAt = uint64(block.timestamp);
        emit TransferCancelled(id, reason);
    }

    function getTransfer(uint256 id) external view returns (Transfer memory) {
        return _get(id);
    }

    function totalTransfers() external view returns (uint256) {
        return _transfers.length;
    }

    function _get(uint256 id) private view returns (Transfer storage) {
        if (id >= _transfers.length) revert InvalidId(id);
        return _transfers[id];
    }
}
