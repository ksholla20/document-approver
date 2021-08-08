# Forge Document Approver

Confluence is a documentation repository. It may contain design docs, implementation docs, Project proposal, or a sales pitch. As a creator of these docs, I feel that the documentation would look complete if the required stakeholders could stamp their sign-off on the document. This inspired us to build this confluence macro.

This is a macro using which a stakeholder, and stakeholder alone can mark the approval for the document. The content writer can add this macro at the beginning of the document (Or anywhere). In the macro configs, the author needs to chose who the approvers are. Approvers can see an approve (or unapprove) button. Once clicked, the status corresponding to that approver turns approved.

If the document is changed after the approver approves, the status turns to _"approved but modified"_. This denotes that the doc has changed. The approver can re-approve the doc again.


## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start

- Build and deploy the app by running:
```
forge deploy
```

- Install the app in an Atlassian site by running:
```
forge install
```

- Develop the app by running `forge tunnel` to proxy invocations locally:
```
forge tunnel
```

### Notes
- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help and provide feedback.
