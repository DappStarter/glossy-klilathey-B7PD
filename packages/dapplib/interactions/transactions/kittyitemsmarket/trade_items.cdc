import FungibleToken from Flow.FungibleToken
import KittyItemsMarket from Project.KittyItemsMarket
import NonFungibleToken from Flow.NonFungibleToken
import KittyItems from Project.KittyItems
import Kibble from Project.Kibble

// This transaction allows the signer to purchase a Kitty Item
// with id == itemID from the marketCollectionAddress

transaction(itemID: UInt64, marketCollectionAddress: Address, itemSignerID: UInt64) {

    let marketTradeCollection: &KittyItemsMarket.TradeCollection{KittyItemsMarket.TradePublic}
    let signerTradeCollection: &KittyItemsMarket.TradeCollection{KittyItemsMarket.TradePublic}

    let signerKittyItemsCollection: &KittyItems.Collection{NonFungibleToken.CollectionPublic}
    let marketKittyItemsCollection: &KittyItems.Collection{NonFungibleToken.CollectionPublic}
    
    prepare(signer: AuthAccount) {
        // Borrows the MarketCollectionAddress' public TradeCollection so we can take the item from it to trade
        self.marketTradeCollection = getAccount(marketCollectionAddress).getCapability(KittyItemsMarket.MarketPublicTradePath)
            .borrow<&KittyItemsMarket.TradeCollection{KittyItemsMarket.TradePublic}>()
            ?? panic("Could not borrow the Market's Trade Collection")

        // Borrows the traderCollectionAddress's public TradeCollection so we can take the item from it to trade
        self.signerTradeCollection = signer.getCapability(KittyItemsMarket.MarketPublicTradePath)
            .borrow<&KittyItemsMarket.TradeCollection{KittyItemsMarket.TradePublic}>()
            ?? panic("Could not borrow the Signer's Trade Collection")
        
        
        //Borrow's the Kitty Items Collection of signer so we can deposit
        //the market trader's NFT into it
        self.signerKittyItemsCollection = signer.getCapability(KittyItems.CollectionPublicPath)
            .borrow<&KittyItems.Collection{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow from the signer's Kitty Items Collection")

        //Borrow's the Kitty Items Collection of who the signer is trading NFTs with so we can deposit
        //the signer's NFT into it
        self.marketKittyItemsCollection = getAccount(marketCollectionAddress).getCapability(KittyItems.CollectionPublicPath)
            .borrow<&KittyItems.Collection{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow from the signer's Kitty Items Collection")
    }

    execute {
        self.marketTradeCollection.trade(itemID: itemID, recipient: self.signerKittyItemsCollection)
        self.signerTradeCollection.trade(itemID: itemSignerID, recipient: self.marketKittyItemsCollection)

    }
}
