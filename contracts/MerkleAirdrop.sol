// Modified from https://github.com/1Hive/airdrop-app/blob/master/contracts/Airdrop.sol
pragma solidity ^0.5.0;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/ownership/Ownable.sol";
// import "@openzeppelin/contracts/math/SafeMath.sol";


/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * `SafeMath` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     * - Subtraction cannot overflow.
     *
     * _Available since v2.4.0._
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     *
     * _Available since v2.4.0._
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts with custom message when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     *
     * _Available since v2.4.0._
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}

/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with GSN meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
contract Context {
    // Empty internal constructor, to prevent people from mistakenly deploying
    // an instance of this contract, which should be used via inheritance.
    constructor () internal { }
    // solhint-disable-previous-line no-empty-blocks

    function _msgSender() internal view returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor () internal {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(isOwner(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Returns true if the caller is the current owner.
     */
    function isOwner() public view returns (bool) {
        return _msgSender() == _owner;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     */
    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

/**
 * @dev Interface of the ERC20 standard as defined in the EIP. Does not include
 * the optional functions; to access them see {ERC20Detailed}.
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}


contract MerkleAirdrop is Ownable {

    using SafeMath for uint256;

    struct Airdrop {
      bytes32 root;
      string dataURI;
      uint unlockEpoch;
      bool paused;
      mapping(address => bool) awarded;
    }

    /// Events
    event Start(uint id);
    event PauseChange(uint id, bool paused);
    event Award(uint id, address recipient, uint amount);

    /// State
    mapping(uint => Airdrop) public airdrops;
    IERC20 public token;
    address public approver;
    uint public airdropsCount;

    // start of the lockup period
    // Wednesday, April 21, 2021 15:00:00 PM UTC+8
    uint256 constant LOCK_START = 1595609911;
    // length of time to delay first epoch
    uint256 constant FIRST_EPOCH_DELAY = 30 days;
    // how long does an epoch last
    uint256 constant EPOCH_DURATION = 1 days;
    // number of epochs
    uint256 constant TOTAL_EPOCHS = 365;

    // Errors
    string private constant ERROR_AWARDED = "AWARDED";
    string private constant ERROR_INVALID = "INVALID";
    string private constant ERROR_PAUSED = "PAUSED";
    string private constant ERROR_LOCKED = "LOCKED";

    function setToken(address _token, address _approver) public onlyOwner {
        token = IERC20(_token);
        approver = _approver;
    }

    /**
     * @notice Start a new airdrop `_root` / `_dataURI`
     * @param _root New airdrop merkle root
     * @param _dataURI Data URI for airdrop data
     */
    function start(bytes32 _root, string memory _dataURI, uint unlockEpoch) public onlyOwner {
        uint id = ++airdropsCount;    // start at 1
        airdrops[id] = Airdrop(_root, _dataURI, unlockEpoch, false);
        emit Start(id);
    }

    /**
     * @notice Pause or resume an airdrop `_id` / `_paused`
     * @param _id The airdrop to change status
     * @param _paused Pause to resume
     */
    function setPause(uint _id, bool _paused) public onlyOwner {
        require(_id <= airdropsCount, ERROR_INVALID);
        airdrops[_id].paused = _paused;
        emit PauseChange(_id, _paused);
    }

    /**
     * @notice Award from airdrop
     * @param _id Airdrop id
     * @param _recipient Airdrop recipient
     * @param _amount The token amount
     * @param _proof Merkle proof to correspond to data supplied
     */
    function award(uint _id, address _recipient, uint256 _amount, bytes32[] memory _proof) public {
        require( _id <= airdropsCount, ERROR_INVALID );

        Airdrop storage airdrop = airdrops[_id];
        require( !airdrop.paused, ERROR_PAUSED );
        require( airdrop.unlockEpoch <= epochsPassed(), ERROR_LOCKED );

        bytes32 hash = keccak256(abi.encodePacked(_recipient, _amount));
        require( validate(airdrop.root, _proof, hash), ERROR_INVALID );

        require( !airdrops[_id].awarded[_recipient], ERROR_AWARDED );

        airdrops[_id].awarded[_recipient] = true;

        token.transferFrom(approver, _recipient, _amount);

        emit Award(_id, _recipient, _amount);
    }

    /**
     * @notice Award from airdrop
     * @param _ids Airdrop ids
     * @param _recipient Recepient of award
     * @param _amounts The amounts
     * @param _proofs Merkle proofs
     * @param _proofLengths Merkle proof lengths
     */
    function awardFromMany(uint[] memory _ids, address _recipient, uint[] memory _amounts, bytes memory _proofs, uint[] memory _proofLengths) public {
        uint totalAmount;

        uint marker = 32;

        for (uint i = 0; i < _ids.length; i++) {
            uint id = _ids[i];
            require( id <= airdropsCount, ERROR_INVALID );
            require( !airdrops[id].paused, ERROR_PAUSED );
            require( airdrops[id].unlockEpoch <= epochsPassed(), ERROR_LOCKED );

            bytes32[] memory proof = extractProof(_proofs, marker, _proofLengths[i]);
            marker += _proofLengths[i]*32;

            bytes32 hash = keccak256(abi.encodePacked(_recipient, _amounts[i]));
            require( validate(airdrops[id].root, proof, hash), ERROR_INVALID );

            require( !airdrops[id].awarded[_recipient], ERROR_AWARDED );

            airdrops[id].awarded[_recipient] = true;

            totalAmount += _amounts[i];

            emit Award(id, _recipient, _amounts[i]);
        }

        token.transferFrom(approver, _recipient, totalAmount);
    }

    function extractProof(bytes memory _proofs, uint _marker, uint proofLength) public pure returns (bytes32[] memory proof) {

        proof = new bytes32[](proofLength);

        bytes32 el;

        for (uint j = 0; j < proofLength; j++) {
            assembly {
                el := mload(add(_proofs, _marker))
            }
            proof[j] = el;
            _marker += 32;
        }

    }

    function validate(bytes32 root, bytes32[] memory proof, bytes32 hash) public pure returns (bool) {

        for (uint i = 0; i < proof.length; i++) {
            if (hash < proof[i]) {
                hash = keccak256(abi.encodePacked(hash, proof[i]));
            } else {
                hash = keccak256(abi.encodePacked(proof[i], hash));
            }
        }

        return hash == root;
    }

    function unlocked(uint _id) public view returns(bool) {
        return epochsPassed() >= _id;
    }

    /**
     * @notice Check if recipient:`_recipient` awarded from airdrop:`_id`
     * @param _id Airdrop id
     * @param _recipient Recipient to check
     */
    function awarded(uint _id, address _recipient) public view returns(bool) {
        return airdrops[_id].awarded[_recipient];
    }

    function epochsPassed() public view returns (uint256) {
        // return 0 if timestamp is lower than start time
        if (block.timestamp < LOCK_START) {
            return 0;
        }

        // how long it has been since the beginning of lockup period
        uint256 timePassed = block.timestamp.sub(LOCK_START);

        // 1st epoch is FIRST_EPOCH_DELAY longer; we check to prevent subtraction underflow
        if (timePassed < FIRST_EPOCH_DELAY) {
            return 0;
        }

        // subtract the FIRST_EPOCH_DELAY, so that we can count all epochs as lasting EPOCH_DURATION
        uint256 totalEpochsPassed = timePassed.sub(FIRST_EPOCH_DELAY).div(EPOCH_DURATION);

        // epochs don't count over TOTAL_EPOCHS
        if (totalEpochsPassed > TOTAL_EPOCHS) {
            return TOTAL_EPOCHS;
        }

        return totalEpochsPassed;
    }

    function epochsLeft() public view returns (uint256) {
        return TOTAL_EPOCHS.sub(epochsPassed());
    }

    function nextEpoch() public view returns (uint256) {
        // get number of epochs passed
        uint256 passed = epochsPassed();

        // if all epochs passed, return
        if (passed == TOTAL_EPOCHS) {
            // return INT_MAX
            return uint256(-1);
        }

        // if no epochs passed, return latest epoch + delay + standard duration
        if (passed == 0) {
            return latestEpoch().add(FIRST_EPOCH_DELAY).add(EPOCH_DURATION);
        }

        // otherwise return latest epoch + epoch duration
        return latestEpoch().add(EPOCH_DURATION);
    }


    function latestEpoch() public view returns (uint256) {
        // get number of epochs passed
        uint256 passed = epochsPassed();

        // if no epochs passed, return lock start time
        if (passed == 0) {
            return LOCK_START;
        }

        // accounts for first epoch being longer
        // lockStart + firstEpochDelay + (epochsPassed * epochDuration)
        return LOCK_START.add(FIRST_EPOCH_DELAY).add(passed.mul(EPOCH_DURATION));
    }


    function finalEpoch() public pure returns (uint256) {
        // lockStart + firstEpochDelay + (epochDuration * totalEpochs)
        return LOCK_START.add(FIRST_EPOCH_DELAY).add(EPOCH_DURATION.mul(TOTAL_EPOCHS));
    }

    function lockStart() public pure returns (uint256) {
        return LOCK_START;
    }
}
