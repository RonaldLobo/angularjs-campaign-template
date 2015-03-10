/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = {
        general :{
            instance: 'livedemo' //Instance configured on the CRM, eg. mostly.trianglecrm.com
        },
        0:{ //default application Path
            landing : {
                template : '/templates/contents/index.html',
                productTypeID : 1, //Project ID
                address2 : false, //You want to ask for Address 2
                country : false, //You want to ask for the Country in case you dont US will be chose by default
                successRedirect: '/#!/Billing'
            },
            billing : {
                productTypeID : 1, //Project ID
                planID : '2',
                trialPackageID : '1',
                chargeForTrial : true,
                campaignID : '1',
                sendConfirmationEmail : 'true',
                description : 'Desc of order',
                address2 : true,
                country : true,
                agree: true,
                selectedCountry: 'US',
                successRedirect: '/#!/Success'
            }
        },
        1:{
            landing : {
                template : '/templates/contents/home1.html',
                productTypeID : 1, //Project ID
                address2 : true, //You want to ask for Address 2
                country : true, //You want to ask for the Country in case you dont US will be chose by default
                agree : true,
                successRedirect: '/#!/BillingUp'
            },
            billing : {
                products:{
                    1:{
                        amount : 89.95,
                        shipping : 4.95,
                        productID : '1',
                        description : 'Desc of charge'
                    },
                    2:{
                        amount : 59.90,
                        shipping : 4.95,
                        productID : '1',
                        description : 'Desc of charge'
                    },
                    3:{
                        amount : 29.95,
                        shipping : 4.95,
                        productID : '1',
                        description : 'Desc of charge'
                    }
                },
                productTypeID: '1',
                campaignID : '1',
                sendConfirmationEmail : 'false',
                downsell : false,
                address2 : true,
                country : true,
                agree: true,
                selectedCountry: 'US',
                successRedirect: '/#!/Success'
            }
        }
    }


