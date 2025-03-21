import { Button, Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

import HybridButton from './hybrid-button';

export function App() {
  return (
    <Theme>
      <div className="flex flex-col gap-4 p-4 align-start">
        <h1 className="text-2xl">1. Css Only</h1>

        <div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
            css-only button
          </button>
        </div>

        <p>
          <strong>This coding style has some pros:</strong>
          <ul className="list-disc pl-5">
            <li>
              It is simple and easy to understand for developers who are
              familiar with traditional CSS.
            </li>
            <li>
              It allows for quick prototyping and styling without the need for
              additional libraries or tools.
            </li>
            <li>
              It keeps the styling separate from the JavaScript logic, following
              the separation of concerns principle.
            </li>
            <li>
              It can be easier to debug and inspect styles using browser
              developer tools.
            </li>
          </ul>
        </p>

        <p>
          <strong>This coding style has some cons:</strong>
          <ul className="list-disc pl-5">
            <li>
              Inline styles can make the component harder to read and maintain.
            </li>
            <li>
              It can lead to duplication of styles if the same styles are used
              in multiple components.
            </li>
            <li>
              It does not take advantage of CSS-in-JS solutions that can provide
              better performance and maintainability.
            </li>
            <li>
              It can be harder to apply global styles or themes consistently
              across the application.
            </li>
          </ul>
        </p>

        <h1 className="text-2xl">2. Framework Only</h1>

        <div>
          <Button>Radix UI Button</Button>
        </div>

        <p>
          <strong>This coding style has some pros:</strong>
          <ul className="list-disc pl-5">
            <li>
              It provides a consistent and cohesive design system out of the
              box.
            </li>
            <li>
              It can speed up development by providing pre-built components.
            </li>
            <li>It ensures better accessibility and usability standards.</li>
            <li>
              It reduces the need for custom styling, leading to less CSS code.
            </li>
          </ul>
        </p>

        <p>
          <strong>This coding style has some cons:</strong>
          <ul className="list-disc pl-5">
            <li>
              It can lead to a lack of flexibility in design customization.
            </li>
            <li>
              It may introduce a learning curve for developers unfamiliar with
              the framework.
            </li>
            <li>It can increase the bundle size if not used carefully.</li>
            <li>
              It may lead to dependency on the framework for future development.
            </li>
          </ul>
        </p>
        <h1 className="text-2xl">3. Hybrid</h1>

        <div className="flex space-x-4 items-center">
          <HybridButton size="large" variant="primary">
            Large Primary Button
          </HybridButton>
          <HybridButton size="medium" variant="secondary">
            Medium Secondary Button
          </HybridButton>
          <HybridButton size="small" variant="danger">
            Small Danger Button
          </HybridButton>
        </div>

        <p>
          <strong>This coding style has some pros:</strong>
          <ul className="list-disc pl-5">
            <li>
              Combines the flexibility of custom CSS with the consistency of a
              framework or standard html button.
            </li>
            <li>Allows for easy customization and theming with variants.</li>
            <li>
              Can leverage the best of both worlds for performance and
              maintainability.
            </li>
          </ul>
        </p>

        <p>
          <strong>This coding style has some cons:</strong>
          <ul className="list-disc pl-5">
            <li>Can be more complex to implement and maintain.</li>
            <li>May require more initial setup and configuration.</li>
            <li>Potential for style conflicts if not managed carefully.</li>
          </ul>
        </p>
      </div>
    </Theme>
  );
}
