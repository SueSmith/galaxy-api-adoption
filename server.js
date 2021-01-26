/*
POSTMAN GALAXY API ADOPTION

This API works in conjunction with the Postman Galaxy API Adoption collection in Postman to walk you through API adoption skills.
Import the collection into Postman from the workspace shared during the session and send a request to the setup endpoint to begin.


This Glitch app is based on hello-express and low-db.

Below you'll see the code for the endpoints in the API after some initial setup processing
  - each endpoint begins "app." followed by get, post, patch, put, or delete, then the endpoint path, e.g. /cat
*/

/*
response structure:

{
    welcome:
      "Welcome! Check out the 'data' object below to see the values returned by the API. Click **Visualize** to see the 'tutorial' data " +
      "for this request in a more readable view.",
    data: {
      cat: {
        name: "Syd",
        humans: 9
      }
    },
    tutorial: {
      title: "You did a thing! 🚀",
      intro: "Here is the _intro_ to this **lesson**...",
      steps: [
        {
          note: "Here is a step with `code` in it...",
          pic:
            "https://assets.postman.com/postman-docs/postman-app-overview-response.jpg",
          raw_data: {
            cat: {
              name: "Syd",
              humans: 9
            }
          }
        }
      ],
      next: [
      {
        step: "Now do this...",
        pic:
          "https://assets.postman.com/postman-docs/postman-app-overview-response.jpg",
        raw_data: {
          cat: {
            name: "Syd",
            humans: 9
          } 
        }
      }
      ]
    }
  }
*/

// server.js
// where your node app starts

const express = require("express");
var bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setup a new database persisted using async file storage
// Security note: the database is saved to the file `db.json` on the local filesystem.
// It's deliberately placed in the `.data` directory which doesn't get copied if someone remixes the project.
var low = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");
var adapter = new FileSync(".data/db.json");
var db = low(adapter);
const shortid = require("shortid");
//email validation
var validator = require("email-validator");
var faker = require("faker");

// default list
var defaultData = [];
var i;
for (i = 0; i < 5; i++)
  defaultData.push({
    id: shortid.generate(),
    phrase: faker.company.catchPhrase(),
    pic: faker.image.image(),
    num: Math.floor(Math.random() * 100) + 1
  });
db.defaults({
  info: defaultData,
  calls: []
}).write();

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  var newDate = new Date();
  db.get("calls")
    .push({
      when: newDate.toDateString() + " " + newDate.toTimeString(),
      where: "GET /",
      what: req.get("-")
    })
    .write();
  if (req.headers["user-agent"].includes("Postman"))
    res.status(200).json({
      welcome: welcomeMsg,
      tutorial: {
        title: process.env.PROJECT,
        intro:
          "Use the " +
          process.env.PROJECT +
          " collection in Postman to learn API Adoption! " +
          "To see the API code navigate to https://glitch.com/edit/#!/" +
          process.env.PROJECT_DOMAIN +
          " in your web browser!"
      }
    });
  else
    res.send(
      "<h1>" +
        process.env.PROJECT +
        "</h1><p>Oh, hi! There's not much to see here - view the code instead:</p>" +
        '<script src="https://button.glitch.me/button.js" data-style="glitch"></script><div class="glitchButton" style="position:fixed;top:20px;right:20px;"></div>'
    );
});

//generic welcome message
var welcomeMsg =
  "You're using the " +
  process.env.PROJECT +
  " course! Check out the 'data' object below to see the values returned by this API request. " +
  "Click **Visualize** to see the 'tutorial' guiding you through next steps - do this for every request in the collection!";
//admin unauthorized
var unauthorizedMsg = {
  welcome: welcomeMsg,
  tutorial: {
    title: "Your request is unauthorized! 🚫",
    intro: "This endpoint requires admin authorization.",
    steps: [
      {
        note: "This endpoint is only accessible to admins for the API."
      }
    ],
    next: [
      {
        step: "Use the admin key indicated in the project env as secret."
      }
    ]
  }
};
//invalid route
var invalidMsg = {
  welcome: welcomeMsg,
  tutorial: {
    title: "Your request is invalid! 🚧",
    intro:
      "Oops this isn't a valid endpoint! " +
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left of Postman."
  }
};

//intro
app.get("/begin", (req, res) => {
  var newDate = new Date();
  db.get("calls")
    .push({
      when: newDate.toDateString() + " " + newDate.toTimeString(),
      where: "GET /begin",
      what: "-"
    })
    .write();
  res.status(200).json({
    welcome: welcomeMsg,
    data: {
      course: process.env.PROJECT
    },
    tutorial: {
      title: "Welcome to " + process.env.PROJECT + " training! 🛰️📣",
      intro:
        "This demo API will help you learn how to build adoption for an API using Postman. We'll learn about " +
        "crafting documentation, using mock data, visualizing request responses, and promoting the API by " +
        "publishing the collection and workspace. This will allow your users to onboard " +
        "faster, importing functional requests straight into Postman along with supporting resources.",
      steps: [
        {
          note:
            "This API provides a few demo endpoints that return random data generated using the faker library " +
            "(which we can also use in Postman as you will see later). _You are welcome to continue playing around with all of the requests " +
            "after the session–and feel free to remix the API on Glitch too galaxy-api-adoption.glitch.me._ 😄"
        },
        {
          note:
            "The request you sent to the API received the following JSON response:",
          raw_data: {
            course: process.env.PROJECT
          }
        },
        {
          note:
            "> ✏️ Each request in the API is going to return some core data and the tutorial data you can access in the Visualizer to " +
            "work through next steps. You will be switching between different views, so whenever you want to get back to the " +
            "instructions, select the request on the left and choose **Body** &gt; **Visualize**. "
        }
      ],
      next: [
        {
          step:
            "Let's take a quick look at the collection documentation Postman generates by default. Click the little paper icon at the top " +
            "right of this request to open the docs. Click **View complete collection documentation** at the bottom and take a look before " +
            "returning here to the `Begin learning` request."
        },
        {
          step:
            "Postman will automatically populate your docs with request **methods**, **names**, **parameters**, **body data**, **auth info**"+
            ", and more. You can add lots of additional information to help users understand the purpose of your API endpoints and get "+
            "started using them. You can edit the details in the documentation view or within the individual requests / collection tabs. "+
            "_Use the little docs button on the right to show / hide the docs as we work through the requests._"
        },
        {
          step:
            "> ✏️ Notice that the address for this request starts with a base URL which is stored in a variable that you " +
            "imported as part of the collection. Hover over the var indicated by `{{url}}` in the address to see the value. Variables " +
            "let you reuse values throughout your collections and they will resolve in your documentation–you can also publish environments "+
            "with your docs and let viewers switch between them."
        },
        {
          step: "Open the next request `Get item` and hit **Send**."
        }
      ]
    }
  });
});

//get item, takes query param (returns demo data)
app.get("/record", (req, res) => {
  var newDate = new Date();
  db.get("calls")
    .push({
      when: newDate.toDateString() + " " + newDate.toTimeString(),
      where: "GET /record",
      what: req.query.id
    })
    .write();
  if (req.query.id) {
    var records = db.get("info").value();
    var rec = records[Math.floor(Math.random() * records.length)];
    res.status(200).json({
      welcome: welcomeMsg,
      data: {
        record: rec
      },
      tutorial: {
        title: "You retrieved a record!",
        intro:
          "This endpoint retrieves a single record from the database. The request specified a record ID using the query parameter. " +
          "_The API doesn't really return the record with the id you specified, just a random record._ 🤫",
        steps: [
          {
            note: "The request returned the following data:",
            raw_data: {
              record: rec
            }
          },
          {
            note:
              "Aside from documentation, one of the best ways to help your users orient themselves with your API is to use meaningful " +
              "request names. Although this API returns junk data, let's pretend it doesn't. At the top of the request tab, hover over the " +
              "name `Get item` and click the little pencil icon to edit it. Give the request a more meaningful name of your choice, for " +
              "example `Get customer`."
          },
          {
            note:
              "#### Add descriptions\n\nWith the documentation for the request open on the right, you'll see that you can add a description for the request. " +
              "Click the text-area with 'Make things easier...' etc in it and enter a request description. You can use markdown, for example:",
            js_code: [
              "Retrieve a single customer.",
              "",
              "_To specify the customer you want to retrieve:_",
              "* Add a **Query parameter** named `id`."
            ]
          },
          {
            note:
              "You can **Preview** to see the rendered markdown at any time. **Save** your description. Before you move on, also save the response, choosing **Save Response** " +
              "&gt; **Save as example**–and rename the example to `Get customer` also then return here and **Send** again."
          },
          {
            note:
              "#### Dynamic examples\n\nTo make the response a little more interesting, we can use dynamic faker variables to generate random values " +
              "whenever the example is generated. Back in the `Get customer` example, replace the value of the `data` &gt; `phrase` property with " +
              '`{{$randomCatchPhrase}}` so that it looks like this: `phrase: "{{$randomCatchPhrase}}",`'
          },
          {
            note:
              "When you start typing `{{$random`, you'll see that there are lots of different random variables which you can use to make " +
              "your docs and demos more dynamic. " +
              "**Save** the example as before. Check out the docs again, following the link to the complete version to see how the different examples " +
              "render–you can select them from the drop-down list."
          },
          {
            note:
              "#### Markdown elements\n\nYou can add links and images to your markdown. To try out an image, grab the URL for the `pic` property in " +
              "the response JSON and include it in your request docs markdown using the following syntax, saving to see the rendered image:",
            js_code: ["![pic](http://placeimg.com/640/480/nightlife)"]
          },
          {
            note: "Try a link also:",
            js_code: ["[Your website](https://postman.com)"]
          }
        ],
        next: [
          {
            step:
              "You added request documentation, but you can also add information at collection level. _Providing a strong intro to your " +
              "collection will give your users the best chance of getting started, including universal info such as auth requirements, "+
              "and example uses cases / workflows._ Click the **Galaxy API Adoption** collection on the left and open its docs on the right. "+
              "Edit the description there too like you did for the request, then come back to `Get customer`."
          },
          {
            step:
              "You can use collections to share information about your APIs in a variety of ways as we'll see in this session. To see a " +
              "preview of what your docs will look like if someone views them on the web outside Postman, **View complete collection " +
              "documentation**, click **Publish** &gt; **Preview documentation** then navigate back here to `Get customer` using the browser back button."
          },
          {
            step: "Open the next request `POST` `Add item` and hit **Send**."
          }
        ]
      }
    }); 
  } else {
    res.status(404).json({
      welcome: welcomeMsg,
      data: {
        message: "Item not specified"
      },
      tutorial: {
        title: "Query parameter required!",
        intro:
          "This endpoint is going to return a record from the database. We're going to add information that will appear in the " +
          "documentation to help users of the API make a successful request.",
        steps: [
          {
            note:
              "The request in this case returned a `404 Not Found` error response because the endpoint " +
              "requires a query parameter named `id`."
          },
          {
            note:
              "Your docs can include example request and response data. The easiest way to create an example is to save a response–so let's " +
              "do that. Postman will autopopulate the example with the response you received, including the parameters sent, status code, "+
              "and body data. Just above the response area click **Save Response** and choose **Save as example**. You can edit "+
              "the example, which we'll do soon, but for now just **Save** it, return here, and send again."
          },
          {
            note:
              "In the docs view next to the request, click **View complete collection documentation** to see how the example " +
              "renders, then return here to `Get item`."
          },
          {
            note:
              "> ✏️ The complete docs will open in a separate tab inside Postman " +
              "so you can toggle back and forth between them and the request you're working on."
          }
        ],
        next: [
          {
            step:
              "In **Params**, check the (initially unchecked) query parameter named `id` so that it will be sent the next time we send the request. "+
              "Add some **Description** text for the `id`, for example `Record id to retrieve`. Click **Save** and " +
              "check out the docs on the right again–the parameter and description appear inline."
          },
          {
            step:
              "Being able to share your collection (and workspace) lets you provide users with prebuilt requests " +
              "they can send alongside information you author (also inside Postman). With the query parameter added and your request " +
              "saved, click **Send**."
          }
        ]
      }
    });
  }
});

//get items
app.get("/records", (req, res) => {
  var newDate = new Date();
  db.get("calls")
    .push({
      when: newDate.toDateString() + " " + newDate.toTimeString(),
      where: "GET /records",
      what: "-"
    })
    .write();
  var data = db.get("info").value();
  res.status(200).json({
    welcome: welcomeMsg,
    data: {
      records: data
    },
    tutorial: {
      title: "You retrieved all records!",
      intro:
        "We've used examples to populate the collection documentation, but we can also use them to return mock data instead of " +
        "connecting to our production API.",
      steps: [
        {
          note:
            "Save the response to this request as an example like you did before and return here. We're going to create a mock server for " +
            "this collection, and you will be able to switch between the mock API and the 'production' one we've been using so far, using an " +
            "environment. The URL for the API is stored in a collection variable, but we're going to store the mock one in an " +
            "environment variable."
        },
        {
          note:
            "> ✏️ Postman variable scope means that if the environment and collection have a variable with the same name, the value in " +
            "the environment will override the collection value, so we're going to add a `url` var to the environment and it will determine " +
            "where the requests send–as long as the environment is selected. If we deselect the environment, the request addresses will " +
            "again use the collection variable URL value."
        }
      ],
      next: [
        {
          step:
            "In **Mock Servers** on the left, create a new mock server and select the existing `Galaxy API Adoption` collection. Enter a " +
            "name for the mock, check **Save the mock server URL as an environment variable** and create the mock server before returning "+
            "here to `Get list`."
        },
        {
          step:
            "Select the new environment from the list at the top right of Postman so that it becomes the _active_ environment (it will have "+
            "the same name as the mock). Click " +
            "the eye button to see that the value of the variable has been set to the new mock server. In the `Get list` request hover over " +
            "the `url` in the address to see that it now points at the mock."
        },
        {
          step: "**Send** to make sure the request returns the same " +
            "response. Try out another request you added an example to, to check that it still works from the mock URL."
        },
        {
          step:
            "> ✏️ If you're in doubt about where a request sent, check out the **Console** at the bottom left of Postman. " +
            "Note that the only requests with saved examples will return a response from the mock server. 😉"
        },
        {
          step:
            "#### Visualizing data\n\nBefore we finish with this collection, let's take a look at what you can do with data visualization in Postman. The " +
            "instructions you've been reading use a script in the collection that renders a tutorial in the **Visualize** view, based on the "+
            "response data returned by the API. You can do much more than this to make your response data come to life, including charts and "+
            "graphs. 🖼️📊"
        },
        {
          step:
            "Go back into `Get customer` and open **Tests**. You'll see some code in there with part of it commented out. Remove the " +
            "`/*` and `*/` at the start and end of the script (so that the code is no longer commented out). Hit **Send** to see what the "+
            "visualizer script does with the response data. Take a look at the HTML inside the `template` in the script to see how this pulls "+
            "data from the response and displays it. Come back to the `Get list` request."
        },
        {
          step:
            "> ✏️ Note that the catchphrase text will change each time you make the request to the mock server because it uses " +
            "a dynamic variable, as it will whenever the documentation loads. Try experimenting with other dynamic variables in your " +
            "examples to introduce more randomness into your demos."
        },
        {
          step:
            "Do the same here in `Get list`, uncommenting out the visualizer code. This one is more complex, using chart.js to " +
            "render a pie chart with the values from the response array. Try tweaking the visualizer code to change the display!"
        },
        {
          step:
            "When you're happy you've completed all the steps and are ready to check your collection for completeness so that you can "+
            "claim your API Adoption badge–open the final request `Test collection`, in the `Complete submission` folder and check out the docs "+
            "for instructions."
        }
      ]
    }
  });
});

//add record - does not really add to db
app.post("/record", (req, res) => {
  const apiSecret = req.get("api_key");
  var newDate = new Date();
  db.get("calls")
    .push({
      when: newDate.toDateString() + " " + newDate.toTimeString(),
      where: "POST /record",
      what: apiSecret
    })
    .write();
  if (!apiSecret || apiSecret.length < 1 || apiSecret.startsWith("{")) {
    res.status(401).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Oops - You got an unauthorized error response! 🚫",
        intro:
          "Your request needs to include an API key. This is a `POST` request to add new data, so needs an API key in order to verify " +
          "permissions to update the data source. 🔒",
        data: {
          message: "No API key included"
        },
        steps: [
          {
            note:
              "When your API requires auth and you're publishing from a Postman collection that you want people to be able to send requests from, " +
              "you need to be careful not to expose credentials to documentation viewers–you also want to set users up to make authenticated " +
              "requests with the minimum of hassle, as this can be a huge stumbling block for people trying to onboard with your API. " +
              "Let's use a variable for the API key, so that you can highlight how users should authenticate, while still avoiding leaking " +
              "your own credentials."
          },
          {
            note:
              "Create an environment–choose **Environments** on the left, then the **+** button. Give it the name `Adoption env` and add a single " +
              "variable named `auth_key`, with any text string value you like e.g. `abc123` then **Save**. Select the environment either at the top right in " +
              "the drop-down list or on the left by hovering over it and clicking the ✔️ check mark to make it _active_."
          },
          {
            note:
              "Select the `Galaxy API Adoption` collection and in **Authorization** choose **API Key**, adding a key named `api_key` with " +
              "the value `{{auth_key}}` to use your variable, and the **Header** selected, then come back to the `POST` request."
          }
        ],
        next: [
          {
            step:
              "In the `POST` `Add item` request, open **Authorization** and select **Inherit auth from parent**–this will use the collection level " +
              "auth settings. Open the complete collection documentation and scroll to the top to see how the auth info is represented. 🔑"
          },
          {
            step:
              "> ✏️ You can publish environments along with collections when you make them public, for example if you provide a " +
              "sandbox environment your API users can interact with–make sure you **do not publish an environment** if " +
              "it contains credentials you don't want to expose."
          },
          {
            step:
              "Make sure you have selected the environment you created to make it active. Click **Send**."
          }
        ]
      }
    });
  } else if (!req.body.id)
    res.status(400).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Your request is incomplete! ✋",
        intro:
          "You need to provide the data you want to update the record with.",
        data: {
          message: "No body data included"
        },
        steps: [
          {
            note:
              "In **Body** select **raw** and choose **JSON** instead of `Text` in the drop-down list. Enter the following " +
              "including the enclosing curly braces:",
            raw_data: {
              id: "{{$randomLoremWord}}",
              phrase: "{{$randomCatchPhrase}}",
              pic: "http://placeimg.com/640/480/cats",
              num: 10
            }
          }
        ],
        next: [
          {
            step: "With your body data in place, click **Send** again."
          }
        ]
      }
    });
  else {
    res.status(201).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "You added a new record! ",
        intro:
          "_You didn't really add a new record, this is just a demo endpoint.._ 🙈",
        data: {
          message: "Record added"
        },
        steps: [
          {
            note:
              "You've seen how collection level info such as auth renders in the documentation–notice that this collection also uses " +
              "folders. Postman will automatically structure your docs using folders and the list of requests–clicking these lets users " +
              "navigate through the information in your docs."
          },
          {
            note:
              "When your users are viewing the collection docs on the web inside a Postman workspace, they can also click **Open Request** to go straight " +
              "to a request from the docs description. You can send people links to all of these components inside a workspace and know that the " +
              "viewer will arrive at whatever resource you want to share."
          },
          {
            note:
              "Let's make the body data a little more dynamic using faker variables. Replace the value of the `id` property with `{{$randomLoremWord}}`"+
              " and the value of `phrase` with `{{$randomCatchPhrase}}` so that it looks something like this:",
            raw_data: {
              id: "{{$randomLoremWord}}",
              phrase: "{{$randomCatchPhrase}}",
              pic: "http://placeimg.com/640/480/cats",
              num: 10
            }
          },
          {
            note: 
              "Postman will generate these each time the docs are viewed or the request is sent."
          }
        ],
        next: [
          {
            step:
              "Before you move on, save the response to this request as an example like you did before by choosing **...** &gt; **Add " +
              "example** &gt; **Save**, and come back here to the `POST` request."
          },
          {
            step: "Next open the `PUT` `Update item` request and hit **Send**."
          }
        ]
      }
    });
  }
});

//update item - does not really update
app.put("/record", function(req, res) {
  const apiSecret = req.get("api_key");
  var newDate = new Date();
  db.get("calls")
    .push({
      when: newDate.toDateString() + " " + newDate.toTimeString(),
      where: "PUT /record",
      what: apiSecret
    })
    .write();
  if (!apiSecret)
    res.status(401).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Oops - You got an unauthorized error response! 🚫",
        intro: "Your request needs to include an API key.",
        data: {
          message: "No API key included"
        },
        steps: [
          {
            note: "In **Authorization** select **Inherit auth from parent**."
          }
        ],
        next: [
          {
            step: "With your API key added to the request, click **Send**."
          }
        ]
      }
    });
  else if (!req.query.id)
    res.status(400).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Your request is missing some info! 📭",
        intro:
          "In order to update a record you need to provide the ID for the record you want to update.",
        data: {
          message: "No id included"
        },
        steps: [
          {
            note:
              "In **Params** add `id` in the **Key** column, and any text value you like as the **Value**."
          }
        ],
        next: [
          {
            step: "With your parameter in place, click **Send** again."
          }
        ]
      }
    });
  else if (!req.body.num)
    res.status(400).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Your request is incomplete! ✋",
        intro:
          "You need to provide the data you want to update the record with.",
        data: {
          message: "No body data included"
        },
        steps: [
          {
            note:
              "In **Body** select **raw** and choose **JSON** instead of `Text` in the drop-down list. Enter the following " +
              "including the enclosing curly braces:",
            raw_data: {
              num: 10
            }
          }
        ],
        next: [
          {
            step: "With your body data in place, click **Send** again."
          }
        ]
      }
    });
  else {
    res.status(201).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "You updated a record! ✅",
        intro:
          "_You didn't really update a record, this is just a demo endpoint.._ 🙈",
        data: {
          message: "Record updated"
        },
        steps: [
          {
            note:
              "You can share collections with your users in multiple ways–by publishing documentation / including a **Run in Postman** " +
              "button on your site, publishing a template, or sharing from a public workspace. Your users can "+
              "import collections from the button in your docs / site, or by forking from a workspace like you did at "+
              "the start of the session."
          },
          {
            note:
              "When you create a public workspace, users can see collections, requests, environments, and more " +
              "in context inside Postman–and you can create links to all of these. In order to use a " +
              "collection from a workspace, your audience will fork it into their own workspace where they can edit and send requests."
          },
          {
            note:
              "The number of collection forks is an indicator of engagement with the resources in a public workspace. Users can also " +
              "comment on your public workspace, and you can even accept pull requests to create an open source contribution pathway. 🚀"
          }
        ],
        next: [
          {
            step:
              "> ✏️ If you just need to share a collection with someone, you can use the collection's public link–from " +
              "the collection **Share** option, choosing **Get public link**, then generate or update the link and copy it. _Note that you will " +
              "need to update the link each time you make a change to the collection as the link acts as a snapshot of the collection._ " +
              "We are going to use this method to check your training session progress before you submit your collection to receive the " +
              "API Adoption badge.. 👀"
          },
          {
            step:
              "Save the response to this request as an example like you did before and come back here to the `PUT` request."
          },
          {
            step: "Next open the `DEL` `Remove item` request and hit **Send**."
          }
        ]
      }
    });
  }
});

//delete item - doesn't really
app.delete("/record/:id", function(req, res) {
  const apiSecret = req.get("api_key");
  var newDate = new Date();
  db.get("calls")
    .push({
      when: newDate.toDateString() + " " + newDate.toTimeString(),
      where: "DEL /record",
      what: apiSecret
    })
    .write();
  if (!apiSecret)
    res.status(401).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Oops - You got an unauthorized error response! 🚫",
        intro: "Your request needs to include an API key.",
        data: {
          message: "No API key included"
        },
        steps: [
          {
            note: "In **Authorization** select **Inherit auth from parent**"
          }
        ],
        next: [
          {
            step: "With your API key added to the request, click **Send**."
          }
        ]
      }
    });
  else {
    res.status(200).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "You deleted a record! 🗑️",
        intro:
          "_You didn't really delete a record, this is just a demo endpoint.._ 😆",
        data: {
          message: "Record removed"
        },
        steps: [
          {
            note:
              "So far we have looked at how you can provide information to help your users onboard with your APIs, however you can also " +
              "share collections and documentation privately with collaborators using team workspaces. Members can see your collections "+
              "together with their documentation, or can view docs from a web link."
          },
          {
            note:
              "Next up we are going to use mock servers to return fake data instead of letting users hit a " +
              "production API, and see some data visualizations on request responses."
          }
        ],
        next: [
          {
            step:
              "Save the response to this request as an example like you did before and come back here to the `DEL` request."
          },
          {
            step: "Open the `Get list` request and hit **Send**."
          }
        ]
      }
    });
  }
});

app.get("/publish", (req, res) => {
  res.status(200).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Publish your workspace! 📣",
        intro:
          "Finally, we are going to walk through publishing your workspace and updating your Postman profile. ✨",
        data: {
          message: "Publish workspace and profile"
        },
        steps: [
          {
            note:
              "In order to publish your completed template, you'll need to first make your Postman profile public (if it isn't already). "+
              "Click your avatar at the top right of Postman and choose **View Profile**. Click **Edit Profile** and switch **Make Profile "+
              "Public** on if it is currently off. Add details including any images and links you want to be visible to your audience. "+
              "**Save** and return to your workspace."
          }
        ],
        next: [
          {
            step:
              "Now that your profile is public, you can go ahead and publish the workspace containing your training template! Click the name of "+
              "the workspace at the top left of Postman to open the workspace overview. You can add a summary and description. "+
              "When you're ready, use the **Sharing** &gt; **Visibility** control on the right to switch the workspace to **Public**!"
          },
          {
            step:
              "> ✏️ Your account admin can set your Postman workspaces to require approval before publishing–with the community manager role."
          },
          {
            step: "Open the final request in the collection `Test collection` and pop the URL for your collection in as the address (select your "+
              "collection, choose **Share** &gt; **Get public link** and generate or update it, then copy and paste into the `Test collection`"+
              " address). Add the URL for your public workspace as the `workspace` value in **Headers** (you can just copy it from the browser address"+
              " bar) and hit **Send** to check your collection for completeness, before filling out the form to get your badge and swag!"
          }
        ]
      }
    });
});

//ADMIN ENDPOINTS

// removes entries from users and populates it with default users
app.get("/reset", (req, res) => {
  const apiSecret = req.get("admin_key");
  if (!apiSecret || apiSecret !== process.env.SECRET) {
    res.status(401).json(unauthorizedMsg);
  } else {
    // removes all entries from the collection
    db.get("info")
      .remove()
      .write();
    console.log("Database cleared");
    var defaultData = [];
    var i;
    for (i = 0; i < 5; i++)
      db.get("info")
        .push({
          id: shortid.generate(),
          phrase: faker.company.catchPhrase(),
          pic: faker.image.image(),
          num: Math.floor(Math.random() * 100) + 1
        })
        .write();

    console.log("Default data added");
    res.status(200).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Database reset",
        intro: "You reset the DB."
      }
    });
  }
});

// removes all entries from the collection
app.get("/clear", (req, res) => {
  const apiSecret = req.get("admin_key");
  if (!apiSecret || apiSecret !== process.env.SECRET) {
    res.status(401).json(unauthorizedMsg);
  } else {
    // removes all entries from the collection
    db.get("info")
      .remove()
      .write();
    console.log("Database cleared");
    res.status(200).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Database cleared",
        intro: "You cleared the DB."
      }
    });
  }
});

//get calls
app.get("/calls", (req, res) => {
  const apiSecret = req.get("admin_key");
  if (!apiSecret || apiSecret !== process.env.SECRET) {
    res.status(401).json(unauthorizedMsg);
  } else {
    // removes all entries from the collection
    var allCalls = db.get("calls").value();
    res.status(200).json({
      welcome: welcomeMsg,
      data: allCalls,
      tutorial: {
        title: "All calls",
        intro: "The calls are as follows:",
        steps: [
          {
            raw_data: allCalls
          }
        ]
      }
    });
  }
});

//reset calls
app.delete("/calls", function(req, res) {
  const apiSecret = req.get("admin_key");
  if (!apiSecret || apiSecret !== process.env.SECRET) {
    res.status(401).json(unauthorizedMsg);
  } else {
    // removes all entries from the collection
    db.get("calls")
      .remove()
      .write();
    res.status(200).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Calls deleted",
        intro: "You deleted the calls."
      }
    });
  }
});

//generic get error
app.get("/*", (req, res) => {
  res.status(400).json(invalidMsg);
});
app.post("/*", (req, res) => {
  res.status(400).json(invalidMsg);
});
app.put("/*", (req, res) => {
  res.status(400).json(invalidMsg);
});
app.patch("/*", (req, res) => {
  res.status(400).json(invalidMsg);
});
app.delete("/*", (req, res) => {
  res.status(400).json(invalidMsg);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
