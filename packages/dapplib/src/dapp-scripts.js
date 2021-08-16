// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
// ⚠️ THIS FILE IS AUTO-GENERATED WHEN packages/dapplib/interactions CHANGES
// DO **** NOT **** MODIFY CODE HERE AS IT WILL BE OVER-WRITTEN
// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨

const fcl = require("@onflow/fcl");

module.exports = class DappScripts {

	static kibble_get_balance() {
		return fcl.script`
				import Kibble from 0x01cf0e2f2f715450
				import FungibleToken from 0xee82856bf20e2aa6
				
				// This script returns an account's Kibble balance.
				
				pub fun main(address: Address): UFix64 {
				    let account = getAccount(address)
				    
				    let vaultRef = account.getCapability(Kibble.BalancePublicPath)
				                    .borrow<&Kibble.Vault{FungibleToken.Balance}>()
				                    ?? panic("Could not borrow Balance reference to the Vault")
				
				    return vaultRef.balance
				}
				
		`;
	}

	static kibble_get_supply() {
		return fcl.script`
				import Kibble from 0x01cf0e2f2f715450
				
				// This script returns the total amount of Kibble currently in existence.
				
				pub fun main(): UFix64 {
				
				    let supply = Kibble.totalSupply
				
				    log(supply)
				
				    return supply
				}
		`;
	}

	static kittyitems_read_collection_ids() {
		return fcl.script`
				// TODO:
				// Add imports here, then do steps 1 and 2.
				import KittyItems from 0x01cf0e2f2f715450
				import NonFungibleToken from 0x01cf0e2f2f715450
				// This script returns an array of all the NFT IDs in an account's Kitty Items Collection.
				
				pub fun main(address: Address): [UInt64] {
				
				    // 1) Get a public reference to the address' public Kitty Items Collection
				    let KittyCollectionRef = getAccount(address).getCapability(KittyItems.CollectionPublicPath)
				                            .borrow<&{NonFungibleToken.CollectionPublic}>()
				                            ?? panic("Could not borrow Kitty Items Collection Reference")
				    // 2) Return the Collection's IDs 
				    //
				    // Hint: there is already a function to do that
				    return KittyCollectionRef.getIDs()
				}
		`;
	}

	static kittyitems_read_collection_length() {
		return fcl.script`
				import NonFungibleToken from 0x01cf0e2f2f715450
				import KittyItems from 0x01cf0e2f2f715450
				
				// This script returns the size of an account's KittyItems collection.
				
				pub fun main(address: Address): Int {
				    let account = getAccount(address)
				
				    let collectionRef = account.getCapability(KittyItems.CollectionPublicPath)
				                            .borrow<&{NonFungibleToken.CollectionPublic}>()
				                            ?? panic("Could not borrow capability from public collection")
				    
				    return collectionRef.getIDs().length
				}
		`;
	}

	static kittyitems_read_kitty_item_type_id() {
		return fcl.script`
				import NonFungibleToken from 0x01cf0e2f2f715450
				import KittyItems from 0x01cf0e2f2f715450
				
				// This script returns the metadata for an NFT in an account's collection.
				
				pub fun main(address: Address, itemID: UInt64): UInt64 {
				
				    // get the public account object for the token owner
				    let owner = getAccount(address)
				
				    let collectionBorrow = owner.getCapability(KittyItems.CollectionPublicPath)
				                                .borrow<&{KittyItems.KittyItemsCollectionPublic}>()
				                                ?? panic("Could not borrow KittyItemsCollectionPublic")
				
				    // borrow a reference to a specific NFT in the collection
				    let kittyItem = collectionBorrow.borrowKittyItem(id: itemID)
				        ?? panic("No such itemID in that collection")
				
				    return kittyItem.typeID
				}
		`;
	}

	static kittyitems_read_kitty_items_supply() {
		return fcl.script`
				import KittyItems from 0x01cf0e2f2f715450
				
				// This scripts returns the number of KittyItems currently in existence.
				
				pub fun main(): UInt64 {    
				    return KittyItems.totalSupply
				}
		`;
	}

	static kittyitemsmarket_read_collection_ids() {
		return fcl.script`
				import KittyItemsMarket from 0x01cf0e2f2f715450
				
				// This script returns an array of all the NFT IDs for sale 
				// in an account's SaleCollection.
				
				pub fun main(marketCollectionAddress: Address): [UInt64] {
				    let marketCollectionRef = getAccount(marketCollectionAddress)
				        .getCapability<&KittyItemsMarket.SaleCollection{KittyItemsMarket.SalePublic}>(
				            KittyItemsMarket.MarketPublicPath
				        )
				        .borrow()
				        ?? panic("Could not borrow market collection from market address")
				    
				    return marketCollectionRef.getIDs()
				}
		`;
	}

	static kittyitemsmarket_read_collection_length() {
		return fcl.script`
				import KittyItemsMarket from 0x01cf0e2f2f715450
				
				// This script returns the size of an account's SaleCollection.
				
				pub fun main(marketCollectionAddress: Address): Int {
				    let marketCollectionRef = getAccount(marketCollectionAddress)
				        .getCapability<&KittyItemsMarket.SaleCollection{KittyItemsMarket.SalePublic}>(
				             KittyItemsMarket.MarketPublicPath
				        )
				        .borrow()
				        ?? panic("Could not borrow market collection from market address")
				    
				    return marketCollectionRef.getIDs().length
				}
		`;
	}

	static kittyitemsmarket_read_trade_collection() {
		return fcl.script`
				import KittyItemsMarket from 0x01cf0e2f2f715450
				
				// This script returns an array of all the NFT IDs for trade 
				// in an account's TradeCollection.
				
				pub fun main(tradeCollectionAddress: Address): [UInt64] {
				    let tradeCollectionRef = getAccount(tradeCollectionAddress)
				        .getCapability<&KittyItemsMarket.TradeCollection{KittyItemsMarket.TradePublic}>(
				            KittyItemsMarket.MarketPublicTradePath
				        )
				        .borrow()
				        ?? panic("Could not borrow market trade collection from trade address")
				    
				    return tradeCollectionRef.getIDs()
				}
		`;
	}

}
