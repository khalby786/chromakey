// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// Runs this code if the plugin is run in Figma
if (figma.editorType === "figma") {
  // This plugin will open a window to prompt the user to enter a number, and
  // it will then create that many rectangles on the screen.

  // This shows the HTML page in "ui.html".
  figma.showUI(__html__, {
    width: 300,
    height: 550,
    themeColors: true,
  });

  // Calls to "parent.postMessage" from within the HTML page will trigger this
  // callback. The callback will be passed the "pluginMessage" property of the
  // posted message.
  figma.ui.onmessage = async (msg: { type: string; count: number }) => {
    if (msg.type === "replace-colors") {
      // Get the selected element
      const selected = figma.currentPage.selection[0] as GeometryMixin;
      
      console.log(selected.fills)
      
      // @ts-expect-error - selected.fills will have a length
      if (!selected.fills || selected.fills.length === 0) {
        figma.notify("Select an image to replace its colors!", {
          error: true,
        });
        
        return;
      }
      
      figma.notify("Processing image with magic 🪄", {
        timeout: Infinity,
      });

      // Idk why this is necessary but it is
      const newFills = [];

      // @ts-expect-error - selected.fills can be iterated acccording to Figma docs
      for (const paint of selected.fills) {
        if (!paint) {
          figma.notify("Select an image to replace its colors!", {
            error: true,
          });

          return
        }

        if (paint.type === "IMAGE") {
          // Get the image hash
          const image = figma.getImageByHash(paint.imageHash);

          // Get the Uint8Array of the image
          const bytes = await image?.getBytesAsync();

          // Send it to the UI
          figma.ui.postMessage({
            type: "u8intArray-input",
            uint8Array: bytes,
          });

          // Wait for the worker's response.
          const newBytes = (await new Promise((resolve, reject) => {
            figma.ui.onmessage = (value) => resolve(value);
          })) as { type: string; uint8Array?: Uint8Array, error?: string };

          // Handle errors
          if (newBytes.type === "error") {
            figma.notify(newBytes.error as string, {
              error: true,
            });
            return;
          }

          // Create a new image with the new bytes
          const newPaint = JSON.parse(JSON.stringify(paint));
          newPaint.imageHash = figma.createImage(
            newBytes.uint8Array as Uint8Array
          ).hash;
          newFills.push(newPaint);

          // Let the people know
          figma.notify("Replaced color!");
        }
      }

      selected.fills = newFills;
    }

    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
  };
}
