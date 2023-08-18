import ThemeSwitcher from "@/components/ThemeSwitcher";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <span className="text-red-500 dark:text-blue-300">text</span>
      <ThemeSwitcher />
    </div>
  );
}
