import { Metadata } from "next"

export const metadata: Metadata = {
  title: "準備中 - Value Emergence System",
  description: "現在サイトの準備中です。しばらくお待ちください。",
}

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md mx-auto text-center px-6">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full mb-6">
            <svg
              className="w-8 h-8 text-orange-600 dark:text-orange-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            準備中
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Value Emergence System のウェブサイトは現在メンテナンス中です。
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            サービスの改善のため一時的にアクセスを制限しております。<br />
            ご不便をおかけして申し訳ございませんが、しばらくお待ちください。
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            お知らせ
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            サイトの更新作業を行っております。<br />
            復旧次第、こちらでお知らせいたします。
          </p>
        </div>

        <div className="text-xs text-gray-400 dark:text-gray-500">
          © 2025 Value Emergence System Project
        </div>
      </div>
    </div>
  )
}
