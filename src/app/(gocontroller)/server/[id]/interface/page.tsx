import { getInterfaces } from "@/actions/database/interfaces";
import { getServerChatConfig } from "@/actions/database/servers";
import InterfaceEditor from "@/components/interface/editor";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatConfigForm from "@/forms/server/interface/chatconfig-form";
import { hasPermission } from "@/lib/auth";
import { routePermissions, routes } from "@/routes";
import { redirect } from "next/navigation";

export default async function ServerInterfacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const canView = await hasPermission(routePermissions.servers.interface, id);

  if (!canView) {
    redirect(routes.dashboard);
  }

  const { data } = await getServerChatConfig(id);

  const { data: interfaces } = await getInterfaces(id);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Manage Interface</h1>
        <h4 className="text-muted-foreground">
          Manage the interface settings.
        </h4>
      </div>

      <Tabs defaultValue="interface" className="w-full h-full">
        <TabsList className="w-full">
          <TabsTrigger value="interface">Interface</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="interface" className="flex flex-col gap-6 h-full">
          {process.env.NODE_ENV === "development" ? (
            <InterfaceEditor
              serverId={id}
              defaultInterface={interfaces[0]}
              defaultInterfaces={interfaces}
            />
          ) : (
            <span className="text-muted-foreground">
              Interface editor is still in development.
            </span>
          )}
        </TabsContent>
        <TabsContent value="chat" className="flex flex-col gap-6">
          <Card className="p-6">
            <ChatConfigForm serverId={id} chatConfig={data} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
