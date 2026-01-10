import { NextRequest, NextResponse } from "next/server";

export const config = {
matcher: ["/((?!api/|_next/|static|.*\\..*).*)"],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "localhost:3000";

  // Настройка доменов
  const rootDomain = process.env.NODE_ENV === "development" ? "localhost:3000" : "ваш-домен.рф";
  const currentHost = hostname.replace(`.${rootDomain}`, "");

  // Если это основной домен — пропускаем
  if (currentHost === "localhost:3000" || currentHost === rootDomain) {
    return NextResponse.next();
  }

  // ВАЖНО: Убрали нижнее подчеркивание перед sites
  // Было: /_sites/${currentHost}...
  // Стало: /sites/${currentHost}...
  url.pathname = `/sites/${currentHost}${url.pathname}`;
  
  return NextResponse.rewrite(url);
}