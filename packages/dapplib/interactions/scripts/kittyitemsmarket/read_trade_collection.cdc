import KittyItemsMarket from Project.KittyItemsMarket

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