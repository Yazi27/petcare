import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-pattern";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackgroundPattern />

      <div className="flex flex-col max-w-[1050px] px-4 mx-auto min-h-screen">
        <AppHeader />
        {children}
        <AppFooter />
      </div>
    </>
  );
}
