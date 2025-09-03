import { useState } from 'react';
import { 
  searchMusicNFTs, 
  getMusicNFTDetails, 
  getMusicNFTOwnershipHistory,
  checkMusicNFTOwnership
} from '../api/airstack';

/**
 * Custom hook for blockchain data operations
 * @returns {Object} Blockchain data operations and state
 */
const useBlockchainData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [nftDetails, setNftDetails] = useState(null);
  const [ownershipHistory, setOwnershipHistory] = useState([]);
  const [ownershipStatus, setOwnershipStatus] = useState(null);

  /**
   * Search for music NFTs by name or artist
   * @param {string} query - Search query
   * @param {number} limit - Maximum number of results
   * @returns {Promise<Object>} Result object with search results or error
   */
  const searchNFTs = async (query, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await searchMusicNFTs(query, limit);
      
      if (result.success) {
        setSearchResults(result.data || []);
      } else {
        setError(result.error.message);
        setSearchResults([]);
      }
      
      return result;
    } catch (err) {
      const errorMsg = 'Failed to search music NFTs';
      setError(errorMsg);
      console.error(errorMsg, err);
      setSearchResults([]);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get details of a specific music NFT
   * @param {string} tokenAddress - Token contract address
   * @param {string} tokenId - Token ID
   * @returns {Promise<Object>} Result object with token details or error
   */
  const getNFTDetails = async (tokenAddress, tokenId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getMusicNFTDetails(tokenAddress, tokenId);
      
      if (result.success) {
        setNftDetails(result.data);
      } else {
        setError(result.error.message);
        setNftDetails(null);
      }
      
      return result;
    } catch (err) {
      const errorMsg = 'Failed to get music NFT details';
      setError(errorMsg);
      console.error(errorMsg, err);
      setNftDetails(null);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get ownership history of a music NFT
   * @param {string} tokenAddress - Token contract address
   * @param {string} tokenId - Token ID
   * @returns {Promise<Object>} Result object with ownership history or error
   */
  const getOwnershipHistory = async (tokenAddress, tokenId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getMusicNFTOwnershipHistory(tokenAddress, tokenId);
      
      if (result.success) {
        setOwnershipHistory(result.data || []);
      } else {
        setError(result.error.message);
        setOwnershipHistory([]);
      }
      
      return result;
    } catch (err) {
      const errorMsg = 'Failed to get ownership history';
      setError(errorMsg);
      console.error(errorMsg, err);
      setOwnershipHistory([]);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if a wallet owns specific music NFTs
   * @param {string} walletAddress - Wallet address to check
   * @param {Array} tokenAddresses - Array of token contract addresses to check
   * @returns {Promise<Object>} Result object with ownership data or error
   */
  const checkOwnership = async (walletAddress, tokenAddresses) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await checkMusicNFTOwnership(walletAddress, tokenAddresses);
      
      if (result.success) {
        setOwnershipStatus(result.data || []);
      } else {
        setError(result.error.message);
        setOwnershipStatus(null);
      }
      
      return result;
    } catch (err) {
      const errorMsg = 'Failed to check music NFT ownership';
      setError(errorMsg);
      console.error(errorMsg, err);
      setOwnershipStatus(null);
      return { success: false, error: { message: errorMsg } };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear all blockchain data state
   */
  const clearData = () => {
    setSearchResults([]);
    setNftDetails(null);
    setOwnershipHistory([]);
    setOwnershipStatus(null);
    setError(null);
  };

  return {
    loading,
    error,
    searchResults,
    nftDetails,
    ownershipHistory,
    ownershipStatus,
    searchNFTs,
    getNFTDetails,
    getOwnershipHistory,
    checkOwnership,
    clearData
  };
};

export default useBlockchainData;
