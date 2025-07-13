import { getInterfaces } from "@/actions/database/interfaces";
import { getChatConfig } from "@/actions/gbxconnector/chat";
import InterfaceEditor from "@/components/interface/editor";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatConfigForm from "@/forms/server/interface/chatconfig-form";

export default async function ServerInterfacePage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  const { data } = await getChatConfig(uuid);

  const { data: interfaces } = await getInterfaces(uuid);

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
              id={uuid}
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
            <ChatConfigForm id={uuid} chatConfig={data} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
