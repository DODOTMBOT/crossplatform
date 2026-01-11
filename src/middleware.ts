import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key");

export const config = {
  matcher: ["/((?!api/|_next/|static|.*\\..*).*)"],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "localhost:3000";
  
  // Берем домен из env или ставим локалхост
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  
  // Логика определения субдомена
  // Если зашли на dodo.prsmx.ru -> currentHost = "dodo"
  // Если зашли на prsmx.ru -> currentHost = "prsmx.ru" (не субдомен)
  let currentHost = hostname;
  if (hostname.includes(rootDomain)) {
      currentHost = hostname.replace(`.${rootDomain}`, "");
  }
  
  // Проверяем, это субдомен или основной сайт
  const isSubdomain = hostname !== rootDomain && hostname !== "localhost:3000" && currentHost !== hostname;

  if (isSubdomain) {
    // === ЗАЩИТА АДМИНКИ РЕСТОРАНА ===
    if (url.pathname.startsWith("/admin") && !url.pathname.includes("/login")) {
      const session = req.cookies.get("session")?.value;
      
      if (!session) {
        url.pathname = `/admin/login`; 
        return NextResponse.redirect(url);
      }

      try {
        await jwtVerify(session, JWT_SECRET);
      } catch (error) {
        url.pathname = `/admin/login`;
        return NextResponse.redirect(url);
      }
    }

    // Переписываем путь, чтобы Next.js показал папку /sites/[site]
    // dodo.prsmx.ru/about -> /sites/dodo/about
    url.pathname = `/sites/${currentHost}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}