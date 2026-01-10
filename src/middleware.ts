import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key");

export const config = {
  matcher: ["/((?!api/|_next/|static|.*\\..*).*)"],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "localhost:3000";
  const rootDomain = process.env.NODE_ENV === "development" ? "localhost:3000" : "ваш-домен.рф";
  const currentHost = hostname.replace(`.${rootDomain}`, "");

  // 1. Обработка субдоменов
  const isSubdomain = currentHost !== "localhost:3000" && currentHost !== rootDomain;

  if (isSubdomain) {
    // ЗАЩИТА АДМИНКИ
    if (url.pathname.startsWith("/admin") && !url.pathname.includes("/login")) {
      const session = req.cookies.get("session")?.value;
      
      // Если нет сессии — редирект на логин
      if (!session) {
        url.pathname = `/admin/login`; // Относительный путь для субдомена
        return NextResponse.redirect(url);
      }

      // Проверка валидности токена
      try {
        await jwtVerify(session, JWT_SECRET);
      } catch (error) {
        url.pathname = `/admin/login`;
        return NextResponse.redirect(url);
      }
    }

    // Переписываем путь для роутера
    url.pathname = `/sites/${currentHost}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}