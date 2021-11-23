# Contributing

We will appreciate developers' contribution to improve node.js code generator, to make it even better. Therefore, any contributions related to features, issues, documentation, translation, guides, and more are all welcomed.

## Got a question?

You can ask questions, consult with more experienced DhiWise users, and discuss DhiWise-related topics in the our [Discord channel](https://discord.gg/hTuNauNjyJ).

## Bugs

If you find a bug in the source code, you can help us by [submitting an issue](https://github.com/DhiWise/nodejs-code-generator/issues/new?assignees=&labels=type%3A%20bug&template=bug_report.md&title=) to our GitHub Repository. Even better, you can submit a Pull Request with a fix.

## Feature Suggestion

You can request a new feature by [submitting an issue](https://github.com/DhiWise/nodejs-code-generator/issues/new?assignees=&labels=type%3A%20feature%20request&template=feature_request.md&title=) to our GitHub Repository.

If you would like to implement a new feature, please submit an issue with a proposal for your work first, to be sure that we can use it. Please consider what kind of change it is:

- For a Major Feature, first open an issue and outline your proposal so that it can be discussed. This will also allow us to better coordinate our efforts, prevent duplication of work, and help you craft the change so that it's successfully integrated in the project.

- Small Features can be added directly [submitted as a Pull Request](#submit-pr).

## What do I need to know to help?

If you want to help out with a code contribution, our project uses the following stack:

### Server-side

- [Node.JS](https://nodejs.org/)

### Client-side

- [React](https://reactjs.org/docs/getting-started.html)

### Testing

- [Jest](https://jestjs.io/) (for testing)


## <a name="submit-pr"></a> How do I make a contribution?

Never made an open source contribution before? Wondering how contributions work in the in our project? Here's a quick rundown!

Find an issue that you're interested in addressing, or a feature that you'd like to add.
You can use [this view](https://github.com/dhiwise/nodejs-code-generator/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) which helps new contributors find easy gateways into our project.

Fork the repository associated with the issue to your local GitHub organization. This means that you'll have a copy of the repository under your-GitHub-username/repository-name.
Clone the repository to your local machine:

```
git clone https://github.com/DhiWise/nodejs-code-generator

```

Create a new branch for your fix:

```
git checkout -b branch-name-here
```

Make the appropriate changes for the issue you are trying to address or the feature that you want to add.

Once done, stage the changes that are ready to be committed:

```
git add .
```

Commit the changes with a short message.

```
git commit -m "<type>:<package>:<message>"
```

CLI for better commit messages

```
npm run commit
```


Push the changes to the remote repository using:

```
git push origin branch-name-here
```

### Branch Guidelines
1. If you are fixing a bug, start the branch name with bug/bug-name
2. If you are adding a feature, start the branch name with feature/feature-name
3. Submit you branch to master by creating a PR.

In the description of the pull request, explain the changes that you made, any issues you think exist with the pull request you made, and any questions you have for the maintainer.

It's okay if your pull request is not perfect (no pull request is), the reviewer will be able to help you fix any problems and improve it!

Wait for the pull request to be reviewed by a maintainer.

Make changes to the pull request if the reviewing maintainer recommends them.

Celebrate your success after your pull request is merged!

### Git Commit Messages

We structure our commit messages like this:

```
<type>(<package>): <subject>
```

Example

```
fix(server): missing entity on init
```

List of types:

- feat: A new feature
- fix: A bug fix
- docs: Changes to the documentation
- refactor: A code change that neither fixes a bug nor adds a feature
- perf: A code change that improves performance
- test: Adding missing or correcting existing tests

### Code of conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

[Code of Conduct](https://github.com/DhiWise/nodejs-code-generator/blob/master/CODE_OF_CONDUCT.md)

Our Code of Conduct means that you are responsible for treating everyone on the project with respect and courtesy.
