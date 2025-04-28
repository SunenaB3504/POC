# Marathi Puppy Rescue - Proof of Concept (POC)

This folder contains a basic HTML, CSS, and JavaScript implementation of the core game loop using text input.

## Running the POC with a Live Server

To easily test the POC and see changes in real-time as you edit the code, you can use a simple local development server. `live-server` is a popular choice that automatically reloads the browser when files change.

**Prerequisites:**

*   **Node.js and npm:** You need Node.js installed on your computer. npm (Node Package Manager) comes bundled with Node.js. You can download Node.js from [https://nodejs.org/](https://nodejs.org/).

**Steps:**

1.  **Open a Terminal or Command Prompt:** Navigate to this directory (`c:\Users\Admin\Nia\Puppy_rescue\POC\`) in your terminal or command prompt.
    ```bash
    cd c:\Users\Admin\Nia\Puppy_rescue\POC\
    ```

2.  **Install `live-server`:** If you haven't installed `live-server` globally before, run the following command. You only need to do this once.
    ```bash
    npm install -g live-server
    ```
    *(Note: On some systems, you might need `sudo` before this command on Linux/macOS, or run the terminal as Administrator on Windows if you encounter permission errors.)*

3.  **Start the Server:** Once `live-server` is installed, run the following command from within the `POC` directory:
    ```bash
    live-server
    ```

4.  **View in Browser:** This command should automatically open the `index.html` file in your default web browser. If it doesn't, look at the terminal output – it will usually say something like `Serving "C:\Users\Admin\Nia\Puppy_rescue\POC" at http://127.0.0.1:8080` (the address and port might vary). You can manually open that address in your browser.

Now, whenever you save changes to `index.html`, `style.css`, or `script.js`, the page in your browser should automatically refresh to show the latest version.

To stop the server, go back to your terminal window and press `Ctrl + C`.

## Inputting Marathi Text

This POC relies on text input. To type in Marathi, you will need to enable a Marathi keyboard layout on your operating system or use a browser-based virtual keyboard.

*   **Operating System:** Most modern operating systems (Windows, macOS, Linux) allow you to add multiple keyboard layouts. Search your system's settings for "Language" or "Region & language" to add Marathi (Devanagari) input.
    *   **Windows:** Look for a language abbreviation (e.g., "ENG" or "MAR") in the taskbar, usually near the clock. Click on it to switch between installed languages/keyboards. Alternatively, use the shortcut `Windows key + Space`.
    *   **macOS:** Look for a flag icon or language symbol in the menu bar. Click on it to select the desired input source. You can also configure a keyboard shortcut in System Settings > Keyboard > Input Sources.
    *   **Linux:** The method varies depending on the desktop environment (GNOME, KDE, etc.). Typically, there's an icon in the system tray or panel to switch layouts.
*   **Browser Extensions:** If you install a virtual keyboard extension, it will usually add an icon to your browser's toolbar. Click this icon to activate or show the virtual keyboard when you need to type Marathi.
    *   **Finding Extensions:** Search the extension store for your browser (e.g., Chrome Web Store, Firefox Add-ons, Microsoft Edge Add-ons) for "Marathi keyboard" or "Devanagari keyboard".
    *   **Example for Edge:** You can search the Microsoft Edge Add-ons store here: [https://microsoftedge.microsoft.com/addons/Microsoft-Edge-Extensions-Home](https://microsoftedge.microsoft.com/addons/Microsoft-Edge-Extensions-Home)
    *   **Switching Languages within the Extension:** Most virtual keyboard extensions support multiple languages. Look for a language indicator (like "EN", "म", or a globe icon) *within the virtual keyboard's interface itself*. Clicking this indicator usually opens a menu allowing you to select Marathi or switch between configured languages. Refer to the specific extension's documentation for exact instructions.

Once enabled, **switch to the Marathi input method** using the methods described above *before* you start typing in the text input field in the application.
