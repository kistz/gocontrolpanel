"use server";

export async function saveInterface(
  serverUuid: number,
  interfaceString: string,
): Promise<void> {
  // Here you would typically send the data to your backend API
  // For example, using fetch or axios:
  // await fetch(`/api/servers/${serverUuid}/interface`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ interfaceString }),
  // });

  console.log(`Saving interface for server ${serverUuid}:`, interfaceString);
}
