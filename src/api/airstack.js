import { request, gql } from 'graphql-request';

// Initialize Airstack API
const AIRSTACK_API_URL = import.meta.env.VITE_AIRSTACK_API_URL;
const AIRSTACK_API_KEY = import.meta.env.VITE_AIRSTACK_API_KEY;

if (!AIRSTACK_API_URL || !AIRSTACK_API_KEY) {
  console.error('Missing Airstack API environment variables. Check your .env file.');
}

// GraphQL headers
const headers = {
  'Authorization': AIRSTACK_API_KEY
};

/**
 * Search for on-chain music NFTs by name or artist
 * @param {string} query - Search query (track name or artist)
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Object>} Result object with search results or error
 */
export const searchMusicNFTs = async (query, limit = 10) => {
  try {
    const searchQuery = gql`
      query SearchMusicNFTs($query: String!, $limit: Int!) {
        TokenSearch(
          input: {
            filter: {
              name: { _regex: $query }
            },
            blockchain: ethereum,
            limit: $limit
          }
        ) {
          Token {
            name
            symbol
            tokenId
            tokenType
            tokenAddress
            blockchain
            owner {
              addresses
              domains {
                name
                isPrimary
              }
            }
            tokenURI
            contentValue {
              image {
                original
              }
              animation_url
              attributes {
                trait_type
                value
              }
            }
          }
        }
      }
    `;

    const variables = {
      query: query,
      limit: limit
    };

    const data = await request(AIRSTACK_API_URL, searchQuery, variables, headers);
    
    return { 
      success: true, 
      data: data.TokenSearch.Token 
    };
  } catch (error) {
    console.error('Airstack search error:', error);
    return { 
      success: false, 
      error: {
        message: error.message || 'Failed to search music NFTs',
        code: error.response?.status || 'airstack_error'
      }
    };
  }
};

/**
 * Get music NFT details by token address and ID
 * @param {string} tokenAddress - Token contract address
 * @param {string} tokenId - Token ID
 * @returns {Promise<Object>} Result object with token details or error
 */
export const getMusicNFTDetails = async (tokenAddress, tokenId) => {
  try {
    const detailsQuery = gql`
      query GetMusicNFTDetails($address: Address!, $tokenId: String!) {
        Token(
          input: {
            address: $address,
            tokenId: $tokenId,
            blockchain: ethereum
          }
        ) {
          name
          symbol
          tokenId
          tokenType
          tokenAddress
          blockchain
          owner {
            addresses
            domains {
              name
              isPrimary
            }
          }
          tokenURI
          contentValue {
            image {
              original
            }
            animation_url
            attributes {
              trait_type
              value
            }
            description
          }
          tokenTransfers {
            from {
              addresses
              domains {
                name
              }
            }
            to {
              addresses
              domains {
                name
              }
            }
            blockTimestamp
            transactionHash
          }
        }
      }
    `;

    const variables = {
      address: tokenAddress,
      tokenId: tokenId
    };

    const data = await request(AIRSTACK_API_URL, detailsQuery, variables, headers);
    
    return { 
      success: true, 
      data: data.Token 
    };
  } catch (error) {
    console.error('Airstack token details error:', error);
    return { 
      success: false, 
      error: {
        message: error.message || 'Failed to get music NFT details',
        code: error.response?.status || 'airstack_error'
      }
    };
  }
};

/**
 * Get music NFT ownership history
 * @param {string} tokenAddress - Token contract address
 * @param {string} tokenId - Token ID
 * @returns {Promise<Object>} Result object with ownership history or error
 */
export const getMusicNFTOwnershipHistory = async (tokenAddress, tokenId) => {
  try {
    const historyQuery = gql`
      query GetMusicNFTOwnershipHistory($address: Address!, $tokenId: String!) {
        TokenTransfers(
          input: {
            filter: {
              tokenAddress: {_eq: $address},
              tokenId: {_eq: $tokenId}
            },
            blockchain: ethereum,
            order: {blockTimestamp: DESC}
          }
        ) {
          TokenTransfer {
            from {
              addresses
              domains {
                name
              }
            }
            to {
              addresses
              domains {
                name
              }
            }
            blockTimestamp
            transactionHash
            blockNumber
          }
        }
      }
    `;

    const variables = {
      address: tokenAddress,
      tokenId: tokenId
    };

    const data = await request(AIRSTACK_API_URL, historyQuery, variables, headers);
    
    return { 
      success: true, 
      data: data.TokenTransfers.TokenTransfer 
    };
  } catch (error) {
    console.error('Airstack ownership history error:', error);
    return { 
      success: false, 
      error: {
        message: error.message || 'Failed to get ownership history',
        code: error.response?.status || 'airstack_error'
      }
    };
  }
};

/**
 * Check if a wallet owns specific music NFTs
 * @param {string} walletAddress - Wallet address to check
 * @param {Array} tokenAddresses - Array of token contract addresses to check
 * @returns {Promise<Object>} Result object with ownership data or error
 */
export const checkMusicNFTOwnership = async (walletAddress, tokenAddresses) => {
  try {
    const ownershipQuery = gql`
      query CheckMusicNFTOwnership($owner: Identity!, $tokens: [Address!]!) {
        TokenBalances(
          input: {
            filter: {
              owner: {_eq: $owner},
              tokenAddress: {_in: $tokens}
            },
            blockchain: ethereum
          }
        ) {
          TokenBalance {
            tokenAddress
            tokenId
            amount
            token {
              name
              symbol
            }
          }
        }
      }
    `;

    const variables = {
      owner: walletAddress,
      tokens: tokenAddresses
    };

    const data = await request(AIRSTACK_API_URL, ownershipQuery, variables, headers);
    
    return { 
      success: true, 
      data: data.TokenBalances.TokenBalance 
    };
  } catch (error) {
    console.error('Airstack ownership check error:', error);
    return { 
      success: false, 
      error: {
        message: error.message || 'Failed to check music NFT ownership',
        code: error.response?.status || 'airstack_error'
      }
    };
  }
};
