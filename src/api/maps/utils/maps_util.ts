import { execFile, exec } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);
const execAsync = promisify(exec);

export async function runAppleScript(script: string): Promise<string> {
  const { stdout } = await execFileAsync("osascript", ["-e", script]);
  return stdout.trim();
}

export interface Location {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export async function searchLocations(query: string): Promise<string> {
  const encodedQuery = encodeURIComponent(query);
  const url = `maps://?q=${encodedQuery}`;

  await execAsync(`open "${url}"`);
  return `Opened Maps search for "${query}"`;
}

export async function getDirections(
  fromAddress: string | undefined,
  toAddress: string,
  transportType: "driving" | "walking" | "transit" = "driving"
): Promise<string> {
  const transportMap: Record<string, string> = {
    driving: "d",
    walking: "w",
    transit: "r"
  };

  const params = new URLSearchParams();
  params.set("daddr", toAddress);
  if (fromAddress) {
    params.set("saddr", fromAddress);
  }
  params.set("dirflg", transportMap[transportType] || "d");

  const url = `maps://?${params.toString()}`;
  await execAsync(`open "${url}"`);

  return `Opened directions to "${toAddress}"${fromAddress ? ` from "${fromAddress}"` : ""} via ${transportType}`;
}

export async function dropPin(address: string, label?: string): Promise<string> {
  const encodedAddress = encodeURIComponent(address);
  let url = `maps://?address=${encodedAddress}`;
  if (label) {
    url += `&q=${encodeURIComponent(label)}`;
  }

  await execAsync(`open "${url}"`);
  return `Dropped pin at "${address}"${label ? ` with label "${label}"` : ""}`;
}

export async function saveLocation(name: string, address: string): Promise<string> {
  const script = `
    tell application "Maps"
      activate
    end tell
    delay 1
    tell application "System Events"
      tell process "Maps"
        -- Search for the location
        keystroke "f" using command down
        delay 0.5
        keystroke ${JSON.stringify(address)}
        delay 1
        keystroke return
        delay 2
      end tell
    end tell
  `;

  await runAppleScript(script);
  return `Searched for "${address}" in Maps. Please save the location manually as "${name}" from the Maps interface.`;
}

export async function listGuides(): Promise<string> {
  const script = `
    tell application "Maps"
      activate
    end tell
    delay 0.5
    tell application "System Events"
      tell process "Maps"
        -- Open the sidebar to show guides
        keystroke "s" using command down
        delay 1
      end tell
    end tell
    return "Guides sidebar opened in Maps"
  `;

  const result = await runAppleScript(script);
  return result;
}

export async function createGuide(name: string): Promise<string> {
  const script = `
    tell application "Maps"
      activate
    end tell
    delay 0.5
    tell application "System Events"
      tell process "Maps"
        -- Open sidebar and create new guide
        keystroke "s" using command down
        delay 1
        -- Click the "+" button for new guide
        click menu item "New Guide" of menu "File" of menu bar 1
        delay 0.5
        keystroke ${JSON.stringify(name)}
        keystroke return
        delay 0.5
      end tell
    end tell
    return "Guide created: ${name.replace(/"/g, '\\"')}"
  `;

  const result = await runAppleScript(script);
  return result;
}

export async function addToGuide(guideName: string, locationQuery: string): Promise<string> {
  // First search for the location, then attempt to add to guide
  const encodedQuery = encodeURIComponent(locationQuery);
  await execAsync(`open "maps://?q=${encodedQuery}"`);

  return `Searched for "${locationQuery}" in Maps. To add to guide "${guideName}", right-click the location pin and select "Add to Guide" > "${guideName}".`;
}
