import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

export default function AuthForm() {
  return (
    <form className="">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" />
      </div>
      <div className="mb-4">
        <Label htmlFor="password">Password</Label>
        <Input id="password" />
      </div>
      <Button>Log In</Button>
    </form>
  );
}
