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

      <Tabs defaultValue="widgets" className="w-full h-full">
        <TabsList className="w-full">
          <TabsTrigger value="widgets">Widgets</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="widgets" className="flex flex-col gap-6 h-full">
          <InterfaceEditor
            serverUuid={uuid}
            defaultInterface={interfaces[0]}
            defaultInterfaces={interfaces}
          />
        </TabsContent>
        <TabsContent value="chat" className="flex flex-col gap-6">
          <Card className="p-6">
            <ChatConfigForm serverUuid={uuid} chatConfig={data} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
