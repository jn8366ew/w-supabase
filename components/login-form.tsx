"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LoginForm() {
  const handleKakaoLogin = async () => {
    console.log("카카오 로그인 클릭");
  };

  const handleGoogleLogin = async () => {
    console.log("구글 로그인 클릭");
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">GroupMeet</CardTitle>
          <CardDescription>소규모 모임 관리 플랫폼</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            className="w-full bg-[#FEE500] text-[#191919] hover:bg-[#FEE500]/90"
            onClick={handleKakaoLogin}
          >
            카카오로 시작하기
          </Button>
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
            Google로 시작하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
