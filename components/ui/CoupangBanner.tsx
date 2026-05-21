'use client'

const iframeHtml = `<!DOCTYPE html>
<html>
<head><style>body{margin:0;overflow:hidden}</style></head>
<body>
<script src="https://ads-partners.coupang.com/g.js"><\/script>
<script>
  new PartnersCoupang.G({"id":991100,"template":"carousel","trackingCode":"AF9566167","width":"680","height":"140","tsource":""});
<\/script>
</body>
</html>`

export default function CoupangBanner() {
  return (
    <div className="mt-10">
      <iframe
        srcDoc={iframeHtml}
        width="680"
        height="140"
        frameBorder="0"
        scrolling="no"
        style={{ maxWidth: '100%', display: 'block' }}
        title="coupang partners"
      />
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
        이 배너는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  )
}
