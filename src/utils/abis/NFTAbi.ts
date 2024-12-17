export const NFTAbi = [
	{
		inputs: [],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		inputs: [],
		name: "ApprovalCallerNotOwnerNorApproved",
		type: "error",
	},
	{
		inputs: [],
		name: "ApprovalQueryForNonexistentToken",
		type: "error",
	},
	{
		inputs: [],
		name: "BalanceQueryForZeroAddress",
		type: "error",
	},
	{
		inputs: [],
		name: "ContractMetadataUnauthorized",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "recipient",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256",
			},
		],
		name: "CurrencyTransferLibFailedNativeTransfer",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "expected",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "actual",
				type: "uint256",
			},
		],
		name: "DropClaimExceedLimit",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_conditionId",
				type: "uint256",
			},
			{
				internalType: "address",
				name: "_claimer",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "_quantity",
				type: "uint256",
			},
			{
				internalType: "address",
				name: "_currency",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "_pricePerToken",
				type: "uint256",
			},
			{
				components: [
					{
						internalType: "bytes32[]",
						name: "proof",
						type: "bytes32[]",
					},
					{
						internalType: "uint256",
						name: "quantityLimitPerWallet",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "pricePerToken",
						type: "uint256",
					},
					{
						internalType: "address",
						name: "currency",
						type: "address",
					},
				],
				internalType: "struct IDrop.AllowlistProof",
				name: "_allowlistProof",
				type: "tuple",
			},
		],
		name: "verifyClaim",
		outputs: [
			{
				internalType: "bool",
				name: "isOverride",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "withdrawTokens",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address",
			},
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getActiveClaimConditionId",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_conditionId",
				type: "uint256",
			},
		],
		name: "getClaimConditionById",
		outputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "startTimestamp",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxClaimableSupply",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "supplyClaimed",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "quantityLimitPerWallet",
						type: "uint256",
					},
					{
						internalType: "bytes32",
						name: "merkleRoot",
						type: "bytes32",
					},
					{
						internalType: "uint256",
						name: "pricePerToken",
						type: "uint256",
					},
					{
						internalType: "address",
						name: "currency",
						type: "address",
					},
					{
						internalType: "string",
						name: "metadata",
						type: "string",
					},
				],
				internalType: "struct IClaimCondition.ClaimCondition",
				name: "condition",
				type: "tuple",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_receiver",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "_quantity",
				type: "uint256",
			},
			{
				internalType: "address",
				name: "_currency",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "_pricePerToken",
				type: "uint256",
			},
			{
				components: [
					{
						internalType: "bytes32[]",
						name: "proof",
						type: "bytes32[]",
					},
					{
						internalType: "uint256",
						name: "quantityLimitPerWallet",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "pricePerToken",
						type: "uint256",
					},
					{
						internalType: "address",
						name: "currency",
						type: "address",
					},
				],
				internalType: "struct IDrop.AllowlistProof",
				name: "_allowlistProof",
				type: "tuple",
			},
			{
				internalType: "bytes",
				name: "_data",
				type: "bytes",
			},
		],
		name: "claim",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
] as const;