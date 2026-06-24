// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {MBGRoles} from "./access/MBGRoles.sol";

/**
 * @title ProcurementRFQ
 * @notice Digital RFQ / quotation board with on-chain supplier reputation —
 *         backs the "B2B Matchmaking untuk Bahan Baku" feature.
 *
 * Solves: manual supplier search, opaque pricing, no comparable offers, and
 * untrusted performance history. RFQs, quotes and awards are transparent and
 * supplier ratings are aggregated immutably on-chain.
 */
contract ProcurementRFQ is MBGRoles {
    enum RFQStatus {
        Open,
        Awarded,
        Closed
    }

    struct Quote {
        bytes32 supplier; // hashed supplier id
        address submitter;
        uint256 unitPrice; // in smallest currency unit (e.g. rupiah)
        uint16 leadTimeDays;
        uint64 submittedAt;
    }

    struct RFQ {
        bytes32 buyer;
        string commodity;
        uint256 qty;
        uint64 deadline;
        RFQStatus status;
        bytes32 awardedSupplier;
        uint64 createdAt;
    }

    struct Reputation {
        uint64 ratingSum;
        uint64 ratingCount;
        uint64 fulfilledOrders;
    }

    RFQ[] private _rfqs;
    mapping(uint256 => Quote[]) private _quotes; // rfqId => quotes
    mapping(bytes32 => Reputation) private _reputation; // supplier => reputation

    event RFQCreated(uint256 indexed rfqId, bytes32 buyer, string commodity, uint256 qty, uint64 deadline);
    event QuoteSubmitted(uint256 indexed rfqId, bytes32 supplier, uint256 unitPrice, uint16 leadTimeDays);
    event QuoteAwarded(uint256 indexed rfqId, bytes32 supplier, uint256 unitPrice);
    event SupplierRated(bytes32 indexed supplier, uint8 score, string ipfsReview);

    error InvalidRFQ(uint256 id);
    error RFQClosed(uint256 id);
    error DeadlinePassed(uint256 id);
    error NoSuchQuote(uint256 id, bytes32 supplier);
    error InvalidRating(uint8 score);

    /// @notice Buyer (operator/regulator) opens an RFQ.
    function createRFQ(
        bytes32 buyer,
        string calldata commodity,
        uint256 qty,
        uint64 deadline
    ) external onlyRole(OPERATOR) returns (uint256 rfqId) {
        rfqId = _rfqs.length;
        _rfqs.push(
            RFQ({
                buyer: buyer,
                commodity: commodity,
                qty: qty,
                deadline: deadline,
                status: RFQStatus.Open,
                awardedSupplier: bytes32(0),
                createdAt: uint64(block.timestamp)
            })
        );
        emit RFQCreated(rfqId, buyer, commodity, qty, deadline);
    }

    /// @notice Supplier submits a competitive quote before the deadline.
    function submitQuote(
        uint256 rfqId,
        bytes32 supplier,
        uint256 unitPrice,
        uint16 leadTimeDays
    ) external onlyRole(SUPPLIER) {
        RFQ storage r = _get(rfqId);
        if (r.status != RFQStatus.Open) revert RFQClosed(rfqId);
        if (r.deadline != 0 && block.timestamp > r.deadline) revert DeadlinePassed(rfqId);

        _quotes[rfqId].push(
            Quote({
                supplier: supplier,
                submitter: msg.sender,
                unitPrice: unitPrice,
                leadTimeDays: leadTimeDays,
                submittedAt: uint64(block.timestamp)
            })
        );
        emit QuoteSubmitted(rfqId, supplier, unitPrice, leadTimeDays);
    }

    /// @notice Buyer awards the RFQ to a quoting supplier.
    function awardQuote(uint256 rfqId, bytes32 supplier) external onlyRole(OPERATOR) {
        RFQ storage r = _get(rfqId);
        if (r.status != RFQStatus.Open) revert RFQClosed(rfqId);

        Quote[] storage qs = _quotes[rfqId];
        uint256 price = 0;
        bool found = false;
        for (uint256 i = 0; i < qs.length; i++) {
            if (qs[i].supplier == supplier) {
                price = qs[i].unitPrice;
                found = true;
                break;
            }
        }
        if (!found) revert NoSuchQuote(rfqId, supplier);

        r.status = RFQStatus.Awarded;
        r.awardedSupplier = supplier;
        _reputation[supplier].fulfilledOrders += 1;
        emit QuoteAwarded(rfqId, supplier, price);
    }

    /// @notice Rate a supplier 1-5 after fulfilment; aggregated on-chain.
    function rateSupplier(bytes32 supplier, uint8 score, string calldata ipfsReview)
        external
        onlyRole(OPERATOR)
    {
        if (score == 0 || score > 5) revert InvalidRating(score);
        Reputation storage rep = _reputation[supplier];
        rep.ratingSum += score;
        rep.ratingCount += 1;
        emit SupplierRated(supplier, score, ipfsReview);
    }

    /// @notice Average rating scaled by 100 (e.g. 470 == 4.70). 0 if unrated.
    function averageRating(bytes32 supplier) external view returns (uint256) {
        Reputation storage rep = _reputation[supplier];
        if (rep.ratingCount == 0) return 0;
        return (uint256(rep.ratingSum) * 100) / rep.ratingCount;
    }

    function getReputation(bytes32 supplier)
        external
        view
        returns (uint64 ratingSum, uint64 ratingCount, uint64 fulfilledOrders)
    {
        Reputation storage rep = _reputation[supplier];
        return (rep.ratingSum, rep.ratingCount, rep.fulfilledOrders);
    }

    function quoteCount(uint256 rfqId) external view returns (uint256) {
        return _quotes[rfqId].length;
    }

    function getQuote(uint256 rfqId, uint256 index) external view returns (Quote memory) {
        return _quotes[rfqId][index];
    }

    function getRFQ(uint256 rfqId) external view returns (RFQ memory) {
        return _get(rfqId);
    }

    function totalRFQs() external view returns (uint256) {
        return _rfqs.length;
    }

    function _get(uint256 id) private view returns (RFQ storage) {
        if (id >= _rfqs.length) revert InvalidRFQ(id);
        return _rfqs[id];
    }
}
