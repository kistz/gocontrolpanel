import { getChatConfig } from "@/actions/gbxconnector/chat";
import InterfaceEditor from "@/components/interface/editor";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatConfigForm from "@/forms/server/interface/chatconfig-form";

export default async function ServerInterfacePage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const { data } = await getChatConfig(id);

  const interfaceString = "";

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
          <InterfaceEditor serverId={id} interfaceString={interfaceString} />
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
