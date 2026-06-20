import { MantineProvider } from "@mantine/core";
import AppDrawer from "./components/AppDrawer";
import SideBar from "./components/Sidebar";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex md:py-8 bg-[#F7F9FB] flex-1">
      <SideBar />
      <AppDrawer />
      <MantineProvider>
        <main className=" xl:ml-[280px] min-h-screen w-full">{children}</main>
      </MantineProvider>
    </div>
  );
}
