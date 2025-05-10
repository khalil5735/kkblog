package java_demo_code;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.StringJoiner;

public class TreeTraversal {
    public static void main(String[] args) {

        TreeNode node4 = new TreeNode(4, null, null);
        TreeNode node5 = new TreeNode(5, null, null);
        TreeNode node2 = new TreeNode(2, node4, node5);
        TreeNode node3 = new TreeNode(3, null, null);
        TreeNode node1 = new TreeNode(1, node2, node3);

        System.out.println("前序遍历：");
        printList(preOrderTraversal(node1));

        System.out.println("中序遍历：");
        printList(inOrderTraversal(node1));

        System.out.println("后序遍历：");
        printList(postOrderTraversal(node1));

    }

    private static void printList(List<Integer> list){
        StringJoiner stringJoiner = new StringJoiner(",", "[", "]");
        for (Integer i : list) {
            stringJoiner.add(String.valueOf(i));
        }
        System.out.println(stringJoiner.toString());
    }


    /**
     * 二叉树前序遍历
     * 
     * @return
     */
    private static List<Integer> preOrderTraversal(TreeNode node) {
        if (node == null) {
            return Collections.emptyList();
        }
        List<Integer> list = new ArrayList<>();
        list.add(node.value);
        list.addAll(preOrderTraversal(node.left));
        list.addAll(preOrderTraversal(node.right));

        return list;
    }

    /**
     * 二叉树中序遍历
     * 
     * @return
     */
    private static List<Integer> inOrderTraversal(TreeNode node) {
        if (node == null) {
            return Collections.emptyList();
        }
        List<Integer> list = new ArrayList<>();
        list.addAll(inOrderTraversal(node.left));
        list.add(node.value);
        list.addAll(inOrderTraversal(node.right));

        return list;
    }

    /**
     * 二叉树后序遍历
     * 
     * @return
     */
    private static List<Integer> postOrderTraversal(TreeNode node) {
        if (node == null) {
            return Collections.emptyList();
        }
        List<Integer> list = new ArrayList<>();
        list.addAll(postOrderTraversal(node.left));
        list.addAll(postOrderTraversal(node.right));
        list.add(node.value);

        return list;
    }
}

/**
 * 树结构
 */
class TreeNode {
    int value;
    TreeNode left;
    TreeNode right;

    public TreeNode() {

    }

    public TreeNode(int value, TreeNode left, TreeNode right) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
}
