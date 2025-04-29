import { redirect } from "next/navigation"

export default function RootPage() {
  // ルートページにアクセスした場合は /ja にリダイレクト
  redirect("/ja")
}
