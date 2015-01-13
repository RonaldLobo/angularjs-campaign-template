/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = {
        general :{
            instance: 'livedemo'
        },
        siteFlow: {
            one : '/',
            two : 'Billing',
            three : 'upsell1',
            four : 'upsell2',
            five : 'confirmation',
            domain: '/'
        },
        BillingFormRequired : {
            address2 : true,
            country : true
        },
        CcFormRequired : {
            shippingForm : true
        },
        IndexBootstrap : {
            ProductTypeID: '10'
        },
        OrderBootstrap : {
            planID : '6',
            trialPackageID : '2',
            chargeForTrial : true,
            campaignID : '1554',
            sendConfirmationEmail : 'true',
            description : 'Desc of order'
        },
        Upsell1Bootstrap : {
            amount : '123',
            shipping : '123',
            productTypeID: '10',
            campaignID : '10',
            productID : '123',
            sendConfirmationEmail : 'false',
            description : 'Desc of charge'
        },
        DownSellBootstrap : {
            amount : '123',
            shipping : '123',
            productTypeID: '10',
            campaignID : '10',
            productID : '123',
            sendConfirmationEmail : 'false',
            description : 'Desc of charge'
        }
    }


