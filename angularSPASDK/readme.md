
The purpose of this template is to allow our customers who have servers running PHP to use an already tested angular.js front-end implementation

##Getting started

- In case that you want to use Gulp and separated angular JS files /JS/App(recommended):
   - Install Node.js on your computer.
   - Install Gulp using *npm install gulp -g*.
   - Check and install any missing dependencies.
   - Run *Gulp* while you are located on the application folder.
- In case you don't want to use gulp, just edit any code you want in the *app.js* file

##Config explain

The config.ini file is located under TriangleCRM folder, and it is in charged of handle all the information related with the costumer, you should updated this file with all your information.

Also there are sections called *billingFormRequired* and *ccFormRequired* which are in charge of set in the template which fields should be shown. 


##Config example

User settings example
```
[Settings]
USERNAME = 'Your username'
PASSWORD = 'Your password'
DOMAIN = 'Your instance'
SITE = ''
WSDL = '/api/2.0/billing_ws.asmx?wsdl'

```

Billing form required example
```
[billingFormRequired]
firstName = true
lastName = true
address = true
address2 = false
city = true
state = true
zip = true
country = false
phone = true
email = true
```

Credit Card form required example
```
[ccFormRequired]
paymentType = true
creditCard = true
cvv = true
exp = true
```

##Bootstrap explained

This template uses a bootstrap object coming from the server, with information like:

- planID
- trialPackageID
- paymentType
- chargeForTrial
- campaign_id
- successRedirect
- downSell
- upSell

the purpose of this implementations is to avoid JS edition, only being needed the editing of the config.ini file.

##Bootstrap example

```
[indexBootstrap]
planID = '56'
trialPackageID = '2'
paymentType = ''
chargeForTrial = true
campaign_id = '117'
successRedirect = 'order.php'
downSell = 'step3.php'
upSell = 'step2-order.php'
```

##Templates explain

Because modular is always better, we have all the html files separated into templates:

- header
- footer
- Main content
- Billing Form (Information related to the costumer: First Name, Last Name...)
- Credit Card Form (Information related to the CC: CC Number, CVV...)


##Templates example

templates/contents/index.php

```
<?php

include '../../TriangleCRM/Controller.php';

$controller = new Controller("boostrap");

$settings = $controller->GetModel("indexBootstrap");  
$required = $controller->GetModel('billingFormRequired');

?>
<script>
    var indexSettings = <?php echo $settings; ?>;
    var downsell = indexSettings.Result.downSell.split('.')[0];// SPA redirect without .php or .html
    var indexShowEl = <?php echo $required; ?>;
</script>

<div class="" ng-include="templates.templateBill">

</div>
```

reviewing line by line the last example

- Include our controller
```
include '../../TriangleCRM/Controller.php';
```

- Create a new instance of the controller saying that we are going to use that instance for boostraping 
```
$controller = new Controller("boostrap");
```

- Get the index Bootstrap model(needed information to submit) and get the Billing Form Required elements
```
$settings = $controller->GetModel("indexBootstrap");  
$required = $controller->GetModel('billingFormRequired');
```

- Setting JS variables with the content coming from the server also, create a downsell variable with the downsell page name
```
<script>
    var indexSettings = <?php echo $settings; ?>;
    var downsell = indexSettings.Result.downSell.split('.')[0];// SPA redirect without .php or .html
    var indexShowEl = <?php echo $required; ?>;
</script>
```

- Add custom html without removing or editing the billing form include
```
...add your custom html code
<div class="" ng-include="templates.templateBill">
    NOT EDIT
</div>
add your custom html code...
```

- Add custom html without removing or editing the billing form include
```
...add your custom html code
<div class="" ng-include="templates.templateBill">
    NOT EDIT
</div>
add your custom html code...
```

- This is how the layout looks like
```
<div class="wrapper">
            <div class="header" static-include="/templates/headers/header.html">
                
            </div>
            <ng-view class="view-animate"></ng-view>
            <div class="footer" static-include="/templates/footers/footer.html">
                
            </div>
        </div>
```


##Full example of implementation

- Download the Repo
- Change the User settings on the config.ini

```
[Settings]
USERNAME = 'your username'
PASSWORD = 'Your password'
DOMAIN = 'Your instance'
SITE = ''
WSDL = '/api/2.0/billing_ws.asmx?wsdl'

```

- Change the required elements by from on the config.ini

  * Billing form required elements
  * Credit Card form required elements

```
[billingFormRequired]
firstName = true
lastName = true
address = true
address2 = false
city = true
state = true
zip = true
country = false
phone = true
email = true
```

```
[ccFormRequired]
paymentType = true
creditCard = true
cvv = true
exp = true
```

- Set your custom information for each bootstrap

```
[indexBootstrap]
planID = '56'  // ID of subscription plan to put customer on. Subscription Plans are configured in CRM and can be used for recurring charges.
trialPackageID = '2' // Should be ID of trial package in subscription manager.
chargeForTrial = true // Boolean option to specify whether the customer should be charged for trial price. If set to "true" function will charge customer immediately and place shipment according to subscription settings.Trial prices and products for subscription plans are configured in CRM. Function will not put the customer on subscription plan if "chargeForTrial" option is set to "true" and charge is failed for trial price.
campaign_id = '117' // Campaign ID for product being sold.
successRedirect = 'order.php' // In case of success after operation redirect here.
downSell = 'step3.php' // In case of leaving the page, redirect here.
upSell = 'step2-order.php' // After success show this other item.
```


- Update the views with your custom html, css(index.css) and JS(scripts.js) code

```
...add your custom html code
<div class="" ng-include="templates.templateBill">
    NOT EDIT
</div>
add your custom html code...
```

- If needed, update the routing on /js/App/Config

```
.when('/index', {
                    templateUrl : '/templates/contents/index.php',
                    controller  : 'InfoCtrl'
            })
```

Where infoCtrl is the controller for a page with a billing form and index.php is the main content to be displayed

```
            .when('/order', {
                    templateUrl : '/templates/contents/order.php',
                    controller  : 'CcCtrl'
            })
```

Where CcCtrl is the controller for a page with the Credit Card form and order.php is the main content to be displayed

**In case that you need a new page** just create the content html page, a new *.when* rule on the js/App/Config/Config.js and set it like a downsell or upsell on the config.ini


##Additional Notes

When you are going to publish your site, please be sure to **Not Publish** the following items:

- Folder node_modules this is only required by gulp during development
- Folder Tests not needed for production
- gulpfile.js only required by Gulp during development
- Folder Docs not necessary for production

Also please not forget to:

- Change the JS file to app.min.js for production








