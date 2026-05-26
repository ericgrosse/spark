import { Heart, MessageCircle, Shield, SlidersHorizontal, X } from "lucide-react-native";
import { useState } from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, spacing } from "@spark/ui";

const people = [
  {
    id: "1",
    name: "Maya",
    age: 31,
    distance: "4 km",
    bio: "Design lead, salsa beginner, very serious about tiny neighborhood bakeries.",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    interests: ["Design", "Dancing", "Coffee"]
  },
  {
    id: "2",
    name: "Rowan",
    age: 29,
    distance: "51 km",
    bio: "Trail runs, documentary nights, and building furniture that only sometimes wobbles.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    interests: ["Hiking", "Film", "DIY"]
  }
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState("discover");
  const [matches, setMatches] = useState<typeof people>([]);
  const person = people[index];

  return (
    <SafeAreaView style={styles.shell}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Spark</Text>
          <Text style={styles.muted}>Nearby discovery</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{matches.length} matches</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {tab === "discover" && person && (
          <View style={styles.card}>
            <Image source={{ uri: person.photo }} style={styles.photo} />
            <View style={styles.cardBody}>
              <Text style={styles.title}>
                {person.name}, {person.age}
              </Text>
              <Text style={styles.muted}>{person.distance}</Text>
              <Text style={styles.bio}>{person.bio}</Text>
              <View style={styles.chips}>
                {person.interests.map((interest) => (
                  <Text style={styles.chip} key={interest}>{interest}</Text>
                ))}
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionButton, styles.pass]} onPress={() => setIndex(index + 1)}>
                <X color={colors.accent} size={30} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.like]}
                onPress={() => {
                  setMatches([...matches, person]);
                  setIndex(index + 1);
                }}
              >
                <Heart color="white" size={30} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {tab === "matches" && (
          <View style={styles.list}>
            {matches.map((match) => (
              <View style={styles.row} key={match.id}>
                <Image source={{ uri: match.photo }} style={styles.avatar} />
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>{match.name}</Text>
                  <Text style={styles.muted} numberOfLines={2}>{match.bio}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {tab === "chat" && (
          <View style={styles.list}>
            <Text style={styles.message}>Hey, your coffee standards sound suspiciously high.</Text>
            <Text style={[styles.message, styles.mine]}>They are peer reviewed.</Text>
          </View>
        )}

        {tab === "privacy" && (
          <View style={styles.list}>
            {["Show distance", "Show online status", "Enable discovery", "Allow notifications"].map((item) => (
              <View style={styles.row} key={item}>
                <Text style={styles.rowTitle}>{item}</Text>
                <Text style={styles.switchText}>On</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.nav}>
        <TouchableOpacity onPress={() => setTab("discover")} style={styles.navButton}>
          <Heart color={tab === "discover" ? colors.primaryStrong : colors.muted} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab("matches")} style={styles.navButton}>
          <Shield color={tab === "matches" ? colors.primaryStrong : colors.muted} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab("chat")} style={styles.navButton}>
          <MessageCircle color={tab === "chat" ? colors.primaryStrong : colors.muted} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab("privacy")} style={styles.navButton}>
          <SlidersHorizontal color={tab === "privacy" ? colors.primaryStrong : colors.muted} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: colors.canvas },
  header: {
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  brand: { fontSize: 30, fontWeight: "800", color: colors.ink },
  muted: { color: colors.muted },
  pill: { borderRadius: 999, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 12, paddingVertical: 8 },
  pillText: { color: colors.ink, fontWeight: "700" },
  content: { padding: spacing.md, paddingBottom: 96 },
  card: { overflow: "hidden", borderRadius: 8, backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1 },
  photo: { width: "100%", aspectRatio: 0.8 },
  cardBody: { padding: spacing.md, gap: spacing.sm },
  title: { fontSize: 30, fontWeight: "800", color: colors.ink },
  bio: { color: colors.ink, fontSize: 16, lineHeight: 23 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: { borderRadius: 999, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 11, paddingVertical: 8, fontWeight: "700" },
  actions: { flexDirection: "row", gap: spacing.md, padding: spacing.md, paddingTop: 0 },
  actionButton: { flex: 1, height: 58, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  pass: { backgroundColor: "#eef3f1" },
  like: { backgroundColor: colors.primary },
  list: { gap: spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, backgroundColor: colors.surface, borderRadius: 8, borderWidth: 1, borderColor: colors.line },
  avatar: { width: 62, height: 62, borderRadius: 8 },
  rowCopy: { flex: 1 },
  rowTitle: { fontSize: 17, fontWeight: "800", color: colors.ink },
  switchText: { marginLeft: "auto", color: colors.accent, fontWeight: "800" },
  message: { maxWidth: "82%", padding: spacing.md, borderRadius: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  mine: { alignSelf: "flex-end", backgroundColor: colors.primary, color: "white" },
  nav: { position: "absolute", left: 0, right: 0, bottom: 0, flexDirection: "row", backgroundColor: colors.surface, borderTopWidth: 1, borderColor: colors.line, padding: spacing.sm },
  navButton: { flex: 1, height: 52, alignItems: "center", justifyContent: "center" }
});
