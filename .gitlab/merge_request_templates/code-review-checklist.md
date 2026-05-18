# Modifications

Describe your modifications here.

# Code review checklist

Go through this checklist before the code is reviewed.

- [ ] **Hand-test your code**
  - Test all acceptance criteria
  - Test any pre-existing features that may have been impacted by your modifications
- [ ] **Reread** all of your modifications with a tool like [Gitk](https://www.atlassian.com/git/tutorials/gitk)
- [ ] **Clean up** your code:
  - Respect the [Python Style Guide](https://systracorp.gitlab.io/hq/docs/methods/software-development-guide/python-style-guide.html)
  - Respect the [JavaScript Style Guide](https://systracorp.gitlab.io/hq/docs/methods/software-development-guide/javascript-style-guide.html)
  - Use a linter
  - The code should be easy to understand; if not, then it should probably be rewritten. If you are tempted to write lots of comments, you should probably rewrite the code to have smaller functions with very explicit names. For the moment SDS doesn't have any best practice guides, but the first section of [Clean Code](https://systragroup.sharepoint.com/:b:/r/sites/cop-softwaredev/Documents/Reference%20Documents/Architecture%20and%20good%20practices/Clean%20Code.pdf?csf=1&web=1&e=uaRv5f) is a good start.
- [ ] **Remove unused code**: commented code, `print` or `console.log()` used for debugging
- [ ] **Update the deployment and/or the development environment**, if needed:
  - `README.md`
  - `docker-compose.yml`
  - Possibly others in [Myapp](https://gitlab.com/systracorp/hq/boilerplates/)
- [ ] **Unit tests**
  - Write unit tests to cover new or modified code
  - Verify that all unit tests pass
- [ ] **Create the `_CHANGELOGS/{Added,Fixed,Changed,Removed}/{branch_name}.md` file**
  - **Do not modify the main `CHANGELOG.md` file!**
  - Use the correct folder for your changes, use multiple if required.
  - Use your branch name as a file base name.
  - Describe any notable changes relevant to users or contributors.
- [ ] **Run a security test**
   - Run `fs-analyze` from the root of your project directory. The contents of `fs-analyze` are the following:
    ```sh
    #!/bin/sh
    exec docker run --rm -t -v "${1:-$PWD}":/app:ro aquasec/trivy fs -s HIGH,CRITICAL --scanners vuln --ignore-unfixed /app
    ```
- [ ] **Update migrations** if there has been a modification to the Django models
  - Run `./manage.py makemigrations` (Or, if you are using `compose`: from the root of `compose`, run `./django makemigrations`)
  - Commit the file generated in `./myapp/migrations/`
- [ ] **Clean the git branch**: `git rebase -i origin/master` or equivalent
  - Squash irrelevant commits on your branch. Often a branch can be squashed into a single commit; this helps the project's history remain uncluttered. Maintain multiple commits if a) the functionalities implemented on them are clearly distinct, b) you carried out major refactoring, in this case the refactoring should be in a separate commit from the feature.
  - Make sure that the commit message is clear and specific for someone unfamiliar with the story. See [Git Flow And Versioning](https://systracorp.gitlab.io/hq/docs/methods/software-development-guide/sds-git-flow.html#commit-messages) for information on the title of commit messages.
- [ ] **Update the issue in** Redmine
  - Set status to `CODE REVIEW` and update time spent
- [ ] **Add a clear description of your modifications to the merge request**
- [ ] **Update diagrams** by running following commands: `poe graphs`
- [ ] **Update the graphql schema** by running following commands: `poe gen_schema`
