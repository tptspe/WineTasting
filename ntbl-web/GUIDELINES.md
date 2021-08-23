# Frontend Development Guidelines

## User Interface

These are best practices that should be used as guidelines while you create UI components for the new design. These guidelines should help us achieve a consistent coding style and quality while splitting a lot of different tasks related to the new designs between the whole team.

If you feel like any of these practices are a burden or if you've got ideas to optimise our workflow, please share it with the team, we're super open to discuss and find better ways to work together!

### New Design

The first mockups for the new design can be downloaded on our Trello board at [Structure for UI makeover](https://trello.com/c/4ffuBFfw/351-structure-for-ui-makeover).

We have a lot of cool visual elements to be turned into React components, and it should be easy to do any changes whenever necessary.

In this `ui` folder it's where we will build all the components to render the pages with the new design. From now on, anything and everything related to design should be built here in this folder, and imported wherever necessary. Need a new state? Add a prop to tell the component, and apply the necessary style here, based on the value of that prop. Following this practice is very important so that we can tweak any visuals with ease and without impacting actual features.

Pages, also called routes, will be built by reusing components from this folder.

Eventually, we should have little or no stylesheets on routes, and centralise all app's style in the folder `src/components/shared/ui`.

### Creating UI Components

Most UI components will be created from design mockups posted on Trello.

Eventually, we may need to create UI components without having design mockups to avoid placing styles in the routes - and it's fine to do that. If you're working on a design task, remember to share a screenshot of your new component so that we can discuss about it. But if you're working on a feature or bugfix, don't worry too much and just create the component you need - we don't want you to be blocked by design issues. We can always double check it on code review, and create another task to fix the styles if neccesary.

### Files Location

All UI components must be placed in the folder `src/components/shared/ui`. They will usually have around three files: the component itself, a stylesheet, and a unit tests file. For that reason, it's good to create a subfolder for each new UI component, and place everything related inside that new subfolder, for example:

```
src/components/shared/ui/
                         TastingTypeCard/
                                         index.js
                                         TastingTypeCard.scss
                                         TastingTypeCard.spec.js
```

### Components Styling

The stylesheets of UI components should not contain any hard coded colours. Instead, add the colours to the theme stylesheet that is found on `src/components/shared/ui/_theme.scss`, and import this stylesheet into yours.

You'll notice in the `_theme.scss` stylesheet that we have two themes: default and contrast. The default theme is intended for anything rendered over a light grey background, and the contrast theme is intended for anything rendered over a purple background with a vineyard picture. Please take this into account if your component would need to be rendered in both themes, and add a prop `theme: PropTypes.oneOf(['default', 'contrast'])` if that's the case.

Prefix the class names in a way that avoids naming conflicts with other UI components or anything else in the app. For example, in a component called `TastingTypeCard`, you could prefix all class names with `TastingTypeCard__`, such as:

```scss
.TastingTypeCard__Container {
	//
}

.TastingTypeCard__Footer {
	//
}

.TastingTypeCard__ThemeContrast .TastingTypeCard__Footer {
	//
}
```

### Images

Images that are exclusive of a UI component should be placed in the same folder of the component.

If the image is SVG, render it with a SVG tag instead of using an IMG tag. It can be achieved with:

```jsx
import { ReactComponent as MyImage } from './someImage.svg';

render() {
  return (
    <div>
      <MyImage />
    </div>
  )
}
```

### Testing UI Components

Write at least two or three unit tests to reduce the risk of losing functionality of UI components over time. Don't abuse of snapshot tests, but prefer to assert manually for everything that's expected and not expected.

## Writing Tests

Our current test stack is:

- Unit and Integration tests: [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/); responsibility of the Frontend Development team
- E2E tests: under research and experiments, will be defined soon; responsibility of the Quality Assurance team

Please read these articles to get an overview of what and how to test:

- https://kentcdodds.com/blog/how-to-know-what-to-test
- https://kentcdodds.com/blog/write-tests
- https://www.youtube.com/watch?v=gJMYMnyA7ZE

### Main Principle

> The more your tests resemble the way your software is used, the more confidence they can give you.

@kentcdodds at [twitter](https://twitter.com/kentcdodds/status/977018512689455106)

For example, consider a form component. Traditionally, lots of people do something like:

```

const usernameInput = wrapper.find('input').first()
const passwordInput = wrapper.find('input').last()

```

We should not do that! Instead, it's better to do:

```

const usernameInput = getByLabelText('Username')
const passwordInput = getByLabelText('Password')

```

Because users look for your fields by their label text, not by the fact that one comes first and the other comes second. If you're not familiar with `getByLabelText` and similar functions, please read the react-testing-library documentation at https://testing-library.com/ before writing any tests. It's really helpful!

Source: tweets from @kentcdodds [here](https://twitter.com/kentcdodds/status/981648459685122048) and [here](https://twitter.com/kentcdodds/status/981648654631976960), see more examples at [this video](https://www.youtube.com/watch?v=gJMYMnyA7ZE)

### Unit Tests

Unit tests are used to test small components or functions without interaction with anything else. Because of covering a small portion of code with no interaction, these are the easiest type of test to write. They generally provide the least value as well, because testing simple stuff that don't change often shouldn't be a big concern.

However, we **must** write unit tests for any function that involves business logic. Be it a simple or a complex function, we don't want issues in any business logic, so, every bit of them should be covered with tests. In this case, testing for business scenarios is more efficient than simply writing tests that target getting test coverage. We may need help from the product owner in this case. Don't hesitate to ask for his help when writing tests for business logic!

We should also write unit tests for UI components or route components, but in this case, having full test coverage shouldn't be a concern. Instead, let's focus on the tests that provides most value, that is, let's focus on how the actual user interaction looks like and test that.

See some examples at [src/reducers/winesReducer.spec.js](src/reducers/winesReducer.spec.js) and [src/components/shared/CheckBox.spec.js](src/components/shared/CheckBox.spec.js).

### Integration Tests

Integration tests are used to test how components interact with each other. UI components or route components will often have unit tests and integration tests. There's no need to separate them in the file, it's just important to cover the necessary cases and relevant edge cases.

Examples of integration tests are a route component that renders a list of items or a modal with a form. The latter can usually have two levels of integration: Route Component > Modal > Form. We should test integration only with the lower intermediary level, for example, if testing the Route Component, only test integration with the Modal component, and if testing the Modal component, only test integration with the Form component. The Route Component should never test integration with the Form component, because it's a concern of the Modal component that it shouldn't care to. We should keep separation of concerns in mind when writing integration tests. We don't want to rewrite tests of components that weren't modified.

Also, it's generally better to mock the components we are testing for integration, so that we isolate their concerns completely, avoiding unnecessary refactors or rewrites on tests. We don't want our integration tests to break if a children component changes the way it renders something. We only want to make sure the children components receives the expected props, and that calling functions passed to their props do the expected action in the parent component.

See some examples at [src/components/events/MyEvents.spec.js](src/components/events/MyEvents.spec.js).

## Ideas and Feedback

Any ideas and feedback are greatly appreciated. Just write it somewhere on Trello and ping the team, and let's discuss it! :)
```
