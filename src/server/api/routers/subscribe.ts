import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";

const subscribeRouter = createTRPCRouter({
  sub: publicProcedure
    .input(
      z.object({ text: z.string().min(5, { message: "min 5 characters" }) })
    )
    .query(({ input }) => {
      return {
        pleaseSub: `Please subscribe to  ${input.text}`,
      };
    }),
});
export default subscribeRouter;
