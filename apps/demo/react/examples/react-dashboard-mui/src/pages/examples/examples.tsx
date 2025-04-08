import {
  Alert,
  Button,
  Input,
  Typography,
  useColorScheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { useAppStore } from "../../store";

function Examples() {
  // themes
  const { mode, setMode } = useColorScheme();

  // i18n
  const { i18n, t } = useTranslation();

  // global state
  const { count, decrement, increment } = useAppStore((state) => state);

  return (
    <div className="flex flex-col gap-4">
      <h1>{mode === "light" ? "Light Mode" : "Dark Mode"}</h1>
      <div>
        <Button
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          variant="contained"
        >
          Toggle {mode === "light" ? "Dark" : "Light"} Mode
        </Button>
      </div>
      <h1>Typography</h1>
      <Typography>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus
        non enim praesent elementum facilisis leo vel. Risus at ultrices mi
        tempus imperdiet. Semper risus in hendrerit gravida rutrum quisque non
        tellus. Convallis convallis tellus id interdum velit laoreet id donec
        ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl
        suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod
        quis viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet
        proin fermentum leo.
      </Typography>
      <h1>Material</h1>
      <div className="flex gap-4">
        <Button variant="contained">Hello world</Button>
        <Button color="secondary" variant="contained">
          Secondary Button
        </Button>
        <Input placeholder="Type here" />
        <Input
          inputProps={{ "aria-label": "password" }}
          placeholder="Password"
          type="password"
        />
      </div>
      <h1>Tailwind</h1>
      <p>
        see front-end accelerator chapter 4 UI how to abstract UI with class
        variants
      </p>
      <div className="flex gap-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Tailwind Button
        </button>
        <input
          className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tailwind Input"
          type="text"
        />
      </div>
      <h1>Css grid responsive</h1>
      <p>
        Don't use normal css or MUI for layout, tailwind is very good for
        flexbox and css grid layouts
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded">Item 1</div>
        <div className="bg-green-500 text-white p-4 rounded">Item 2</div>
        <div className="bg-red-500 text-white p-4 rounded">Item 3</div>
        <div className="bg-yellow-500 text-white p-4 rounded">Item 4</div>
        <div className="bg-purple-500 text-white p-4 rounded">Item 5</div>
        <div className="bg-pink-500 text-white p-4 rounded">Item 6</div>
      </div>
      <h1> Flex Box</h1>
      <div className="flex flex-wrap gap-4">
        <div className="bg-blue-500 text-white p-4 rounded">Flex Item 1</div>
        <div className="bg-green-500 text-white p-4 rounded">Flex Item 2</div>
        <div className="bg-red-500 text-white p-4 rounded">Flex Item 3</div>
        <div className="bg-yellow-500 text-white p-4 rounded">Flex Item 4</div>
        <div className="bg-purple-500 text-white p-4 rounded">Flex Item 5</div>
        <div className="bg-pink-500 text-white p-4 rounded">Flex Item 6</div>
      </div>
      <h1>Global State</h1>
      <div className="flex gap-4">
        <Button onClick={increment} variant="contained">
          Increment
        </Button>
        <Button color="warning" onClick={decrement} variant="contained">
          Decrement
        </Button>
      </div>
      <Alert>Count: {count}</Alert>

      <h1>Translation</h1>
      <div className="flex gap-4">
        <Button onClick={() => i18n.changeLanguage("en")} variant="contained">
          English
        </Button>
        <Button onClick={() => i18n.changeLanguage("fr")} variant="contained">
          French
        </Button>
        <Button onClick={() => i18n.changeLanguage("nl")} variant="contained">
          Dutch
        </Button>
      </div>

      <h2>{i18n.language}</h2>
      <p className="font-bold">{t("title")}</p>
      <p>{t("description.part1")}</p>
      <p>{t("description.part2")}</p>
    </div>
  );
}

export default Examples;
