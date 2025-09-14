import { redirect } from "next/navigation"

export default function RootPage() {
  // ルートページにアクセスした場合は準備中ページにリダイレクト
  redirect("/maintenance")
}
