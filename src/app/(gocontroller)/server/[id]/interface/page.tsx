import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ServerInterfacePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Manage Interface</h1>
        <h4 className="text-muted-foreground">
          Manage the interface settings.
        </h4>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="widgets">Widgets</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex flex-col gap-6">
          <Card className="p-6">
          </Card>
        </TabsContent>
        <TabsContent value="widgets" className="flex flex-col gap-6">
          <Card className="p-6">
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
