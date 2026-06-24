// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title MBGRoles
 * @notice Minimal, dependency-free role-based access control shared by the
 *         MBG Chain contracts. Mirrors the four platform stakeholders so the
 *         on-chain permissions match the application's role model.
 *
 *  - REGULATOR : Pemerintah (issues/revokes permits, confirms transfers)
 *  - INSPECTOR : Field auditor (records inspections)
 *  - OPERATOR  : SPPG / Dapur (proposes transfers, creates RFQs)
 *  - SUPPLIER  : Mitra / Vendor (submits quotes)
 */
abstract contract MBGRoles {
    bytes32 public constant REGULATOR = keccak256("REGULATOR");
    bytes32 public constant INSPECTOR = keccak256("INSPECTOR");
    bytes32 public constant OPERATOR = keccak256("OPERATOR");
    bytes32 public constant SUPPLIER = keccak256("SUPPLIER");

    address public admin;
    mapping(bytes32 => mapping(address => bool)) private _roles;

    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
    event AdminTransferred(address indexed previousAdmin, address indexed newAdmin);

    error NotAdmin();
    error MissingRole(bytes32 role);
    error ZeroAddress();

    constructor() {
        admin = msg.sender;
        // bootstrap: deployer holds every role for easy local testing
        _roles[REGULATOR][msg.sender] = true;
        _roles[INSPECTOR][msg.sender] = true;
        _roles[OPERATOR][msg.sender] = true;
        _roles[SUPPLIER][msg.sender] = true;
    }

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    modifier onlyRole(bytes32 role) {
        if (!_roles[role][msg.sender]) revert MissingRole(role);
        _;
    }

    function hasRole(bytes32 role, address account) public view returns (bool) {
        return _roles[role][account];
    }

    function grantRole(bytes32 role, address account) external onlyAdmin {
        if (account == address(0)) revert ZeroAddress();
        _roles[role][account] = true;
        emit RoleGranted(role, account, msg.sender);
    }

    function revokeRole(bytes32 role, address account) external onlyAdmin {
        _roles[role][account] = false;
        emit RoleRevoked(role, account, msg.sender);
    }

    function transferAdmin(address newAdmin) external onlyAdmin {
        if (newAdmin == address(0)) revert ZeroAddress();
        emit AdminTransferred(admin, newAdmin);
        admin = newAdmin;
    }
}
