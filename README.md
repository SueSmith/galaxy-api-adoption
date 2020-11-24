# Postman Galaxy - API Adoption Training

This project is designed to support Postman training sessions. The API returns learning content for display inside Postman using the Postman visualizer. The API is complemented by a Postman template to guide learners through the steps to reach learning outcomes for the session. The API is developed and deployed on [Glitch](https://glitch.com/~galaxy-api-adoption) however you can deploy it somewhere else if you prefer.

To try out the template, import it into Postman (instructions provided during the session). _Note that the template will not go live until the Postman Galaxy Conference in February 2021._

## Contribution and usage

You can contribute to both the API and the template for the session–note that the experience is designed to teach the learning outcomes indicated by the Galaxy API Adoption badge criteria so please keep this in mind with any content changes. Trainee submissions also need to be testable by automation (learners submit their collection links and we run a script on the collection JSON to ensure that it contains required elements) so any changes to the completed template will need to be accommodated by the submission testing process.

To contribute to the API:

* Fork the [GitHub repo](https://github.com/SueSmith/galaxy-api-adoption).
* In [Glitch](https://glitch.com/) create a new project, choosing **Import from GitHub**. Enter the URL for your fork of the repo.
* Setup the following variables in the `env`:
    * `SECRET` - you'll need to pass this in the auth as `admin_key` from your requests if you need to access admin endpoints, just choose your own for your forked version of the API and include it in your forked template
    * `PROJECT` - this should just be the project name i.e. `Galaxy API Adoption` (needs to match the template name)
* Make and test your changes on Glitch.
* Export your Glitch project to your GitHub fork by choosing **Tools** &gt; **Import and Export** &gt; **Export to GitHub** (you will need to connect your GitHub and Glitch accounts–check out the [Glitch help](https://help-center.glitch.me/help/github/) if you need more info).
* Once your changes are back on GitHub, open a pull request to merge them into the main repo (tip: include a link to your deployed Glitch app for testing).
* _When your changes are merged, the repo owner will push them to the main Glitch app._

While you're developing your API changes, you'll want to test them in Postman using the project template. You can also contribute to the template. If you're a member of the Postman company team:

* Request access to the Postman team `Galaxy training` workspace (create an issue in the [repo](https://github.com/SueSmith/galaxy-api-adoption/issues) or ask [Sue](https://github.com/suesmith/)).
* Fork the `Galaxy API Adoption` collection `training-session` branch–this is the collection as it will be on import, see the parent branch for an example of the collection state on completion by the learner.
* Pop the URL for your forked version of the Glitch API into the collection request addresses (later in the session the URL is stored as a var but not initially).
* Test any API changes you're making to the API using the template.
* If you're contributing to the template, make your changes on your template fork and open a pull request inside Postman to have your changes merged into the main template. _Note that you will need to work through the existing API steps in order to try out your own components within the complete learning experience._

___If you're making changes to both the API and template and they need to be deployed in conjunction with one another, flag that up in both your pull requests (on GitHub and in Postman).___

## Feedback

If you'd like to provide feedback or make a feature request / suggestion about the API or template, please feel free to [create an issue](https://github.com/SueSmith/galaxy-api-adoption/issues).

## Credits

This API is based on the Glitch [hello-express](https://glitch.com/~hello-express) and [low-db](https://glitch.com/~low-db) apps.
