function readArg(flag: string): string | undefined {
  const index = process.argv.indexOf(flag)

  if (index === -1) {
    return undefined
  }

  return process.argv[index + 1]
}

async function main(): Promise<void> {
  const userId = readArg("--user-id")
  const email = readArg("--email")

  const { sendEventRecommendationEmailsBatch } = await import(
    "../src/features/events/api/event-recommendation-email.server"
  )

  const results = await sendEventRecommendationEmailsBatch({
    userId,
    email,
  })

  if (results.length === 0) {
    console.log("No se encontraron usuarios para procesar.")
    return
  }

  for (const result of results) {
    if (result.status === "sent") {
      console.log(
        `✓ Enviado a ${result.email} — evento ${result.eventId} (${result.recommendation.event.title})`
      )
      continue
    }

    if (result.status === "skipped") {
      console.log(`○ Omitido (${result.userId}): ${result.reason}`)
      continue
    }

    console.log(`✗ Falló (${result.userId}): ${result.error}`)
  }

  const sentCount = results.filter((result) => result.status === "sent").length
  const skippedCount = results.filter((result) => result.status === "skipped").length
  const failedCount = results.filter((result) => result.status === "failed").length

  console.log(
    `\nResumen: ${sentCount} enviados, ${skippedCount} omitidos, ${failedCount} fallidos.`
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
