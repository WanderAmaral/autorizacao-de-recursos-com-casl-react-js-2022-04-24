import { useState } from "react";
import { buildAbility } from "./guards/ability";
import { GuardContext } from "./guards/GuardContext";
import { getAbilitiesByUser, UserType } from "./guards/userAbilities";
import { Home } from "./pages/Home";
import { HomeDiv } from "./style";

function App() {
  const [user, setUser] = useState<UserType>("user");
  const userAbilities = getAbilitiesByUser(user);
  const ability = buildAbility(userAbilities);

  return (
    <GuardContext.Provider value={ability}>
      <HomeDiv>
        <button onClick={() => setUser("user")}>User</button>
        <button onClick={() => setUser("admin")}>Admin</button>
        <Home />
      </HomeDiv>
    </GuardContext.Provider>
  );
}

export default App;
