lazy val shamir = project
  .in(file("."))
  .settings(
    name := "Shamir's Secret Sharing",
    version := "current",
    scalaVersion := "3.3.0",
    scalacOptions ++= Seq("-deprecation", "-unchecked"),
  )
