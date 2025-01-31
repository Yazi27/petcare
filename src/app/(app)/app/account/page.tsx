import ContentBlock from "@/components/content-block";
import H1 from "@/components/h1";
import React from "react";

export default function AccountPage() {
  return (
    <div className="h-full w-full">
      <H1 className="">Account</H1>
      <ContentBlock>
        <p>Logged in as ...</p>
      </ContentBlock>
    </div>
  );
}
