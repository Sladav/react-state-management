
### Initial description for test app
The test app will be a set of list managers. The list managers will contain a list of items. Each will have an input box and an add button to add new items. Each list item will have a remove button. There will also but a button/input that changes the colors for the list items at the top which applies to all lists/list managers.

#### Goals
  - Test out using "provider" + "connector" to dynamically respond to observable data in App state.
  - Test out defining actions as special event handlers - the only way to modify App state
  - Create easy to use system that makes it impossible to directly modify data
  - Stretch goal #1: Isolate sub-apps
  - Stretch goal #2: Create API for interacting with sub-apps

## Intentions
  - List managers will be "large sub-apps" that need their own internal state management
  - List items will be "far" from top level (so will connect directly to app state)
