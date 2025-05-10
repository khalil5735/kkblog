package java_demo_code;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

/**
 * 表达式计算
 */
public class ExpressionCompute {

    public static void main(String[] args) {
        String express = "(3+4)*5+60-100/2";
        List<String> exList = parseExpress2List(express);
        // exList.forEach(i->System.out.println(i));
        int result = infixExpressionCompute(exList);
        System.out.println(result);
    }

    private static List<String> parseExpress2List(String express) {
        char[] charArray = express.toCharArray();
        List<String> expList = new ArrayList<>();

        StringBuilder sb = new StringBuilder();
        for (char c : charArray) {
            if (Character.isDigit(c)) {
                sb.append(c);
            } else {
                if (sb.length() > 0) {
                    expList.add(sb.toString());
                    sb = new StringBuilder();
                }

                expList.add(String.valueOf(c));
            }
        }

        if (sb.length() > 0) {
            expList.add(sb.toString());
        }

        return expList;
    }

    /**
     * 中缀表达式求值,加减乘除,左括号，右括号
     */
    private static int infixExpressionCompute(List<String> expressList) {
        Stack<Integer> digstStack = new Stack<>();
        Stack<String> opStack = new Stack<>();
        for (String fragment : expressList) {
            if ("(".equals(fragment)) {
                // 如果是左括号，直接压入操作符栈
                opStack.push(fragment);
            } else if (")".equals(fragment)) {
                // 如果是右括号，弹出1个操作符栈和2个计算数栈数进行计算，直到遇到左括号
                while (!"(".equals(opStack.peek())) {
                    String op = opStack.pop();
                    Integer rightDigst = digstStack.pop();
                    Integer leftDigst = digstStack.pop();
                    digstStack.push(compute(op, leftDigst, rightDigst));
                }
                // 弹出左括号
                opStack.pop();
            } else if ("*".equals(fragment) || "/".equals(fragment) || "+".equals(fragment) || "-".equals(fragment)) {
                while (!opStack.isEmpty() && !"(".equals(opStack.peek())
                        && getPriority(opStack.peek()) >= getPriority(fragment)) {
                    String op = opStack.pop();
                    Integer rightDigst = digstStack.pop();
                    Integer leftDigst = digstStack.pop();
                    digstStack.push(compute(op, leftDigst, rightDigst));
                }
                opStack.push(fragment);
            } else {
                // 计算数
                digstStack.push(Integer.parseInt(fragment));
            }
        }

        while (!opStack.isEmpty()) {
            String op = opStack.pop();
            Integer rightDigst = digstStack.pop();
            Integer leftDigst = digstStack.pop();
            digstStack.push(compute(op, leftDigst, rightDigst));
        }

        return digstStack.pop();
    }

    private static int getPriority(String op) {
        if ("*".equals(op) || "/".equals(op)) {
            return 2;
        } else {
            return 1;
        }
    }

    private static int compute(String op, Integer left, Integer right) {
        switch (op) {
            case "+":
                return left + right;
            case "-":
                return left - right;
            case "*":
                return left * right;
            case "/":
                return left / right;
            default:
                throw new IllegalArgumentException("不合法的操作符");
        }
    }

}
