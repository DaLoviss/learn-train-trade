import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/free-education")({ component: () => <Outlet /> });
