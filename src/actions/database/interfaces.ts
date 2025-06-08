"use server";

export async function saveInterface(
  serverId: number,
  interfaceString: string,
): Promise<void> {
  // Here you would typically send the data to your backend API
  // For example, using fetch or axios:
  // await fetch(`/api/servers/${serverId}/interface`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ interfaceString }),
  // });

  console.log(`Saving interface for server ${serverId}:`, interfaceString);
}